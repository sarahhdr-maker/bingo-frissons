// Logique de l'API du bingo. Le stockage (store) est fourni par la fonction Netlify.
const HEADERS = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };

function json(body, status) {
  return new Response(JSON.stringify(body), { status: status || 200, headers: HEADERS });
}

function num(v) {
  return typeof v === 'number' && isFinite(v) ? v : null;
}

function cleanControl(c) {
  c = c || {};
  return {
    startedAt: num(c.startedAt),
    pausedAt: num(c.pausedAt),
    endedAt: num(c.endedAt),
    pausedTotal: num(c.pausedTotal) || 0,
    shift: num(c.shift) || 0,
    resetAt: num(c.resetAt) || 0
  };
}

function cleanPlayer(b) {
  b = b || {};
  const marks = {};
  const src = b.marks && typeof b.marks === 'object' ? b.marks : {};
  Object.keys(src).forEach((id) => {
    const n = Number(id);
    if (!Number.isInteger(n) || n < 1 || n > 24) return;
    const m = src[id] || {};
    if (num(m.ms) === null) return;
    marks[String(n)] = { ms: m.ms, film: num(m.film) };
  });
  return {
    display: String(b.display || '').slice(0, 40),
    norm: String(b.norm || '').slice(0, 40),
    marks,
    lineAt: num(b.lineAt),
    updatedAt: Date.now()
  };
}

export async function handle(req, store, orgaCode) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api/, '') || '/';
  const isOrga = (c) => String(c || '').trim().toUpperCase() === String(orgaCode).trim().toUpperCase();

  try {
    if (path === '/control' && req.method === 'GET') {
      return json({ control: await store.get('control', { type: 'json' }) });
    }
    if (path === '/control' && req.method === 'POST') {
      const body = await req.json();
      if (!isOrga(body.code)) return json({ error: 'code' }, 401);
      const clean = cleanControl(body.control);
      const prev = await store.get('control', { type: 'json' });
      clean.resetAt = (prev && prev.resetAt) || 0;
      await store.setJSON('control', clean);
      return json({ control: clean });
    }
    if (path === '/players' && req.method === 'GET') {
      if (!isOrga(req.headers.get('x-orga-code'))) return json({ error: 'code' }, 401);
      const { blobs } = await store.list({ prefix: 'players/' });
      const out = {};
      await Promise.all(blobs.map(async (b) => {
        const p = await store.get(b.key, { type: 'json' });
        if (p) out[b.key.slice('players/'.length)] = p;
      }));
      return json({ players: out });
    }
    if (path === '/reset' && req.method === 'POST') {
      const body = await req.json();
      if (!isOrga(body.code)) return json({ error: 'code' }, 401);
      const { blobs } = await store.list({ prefix: 'players/' });
      await Promise.all(blobs.map((b) => store.delete(b.key)));
      const clean = cleanControl({ resetAt: Date.now() });
      await store.setJSON('control', clean);
      return json({ control: clean });
    }
    const m = path.match(/^\/player\/([a-z0-9-]{1,40})$/);
    if (m && req.method === 'GET') {
      return json({ player: await store.get('players/' + m[1], { type: 'json' }) });
    }
    if (m && req.method === 'PUT') {
      const text = await req.text();
      if (text.length > 20000) return json({ error: 'size' }, 413);
      const clean = cleanPlayer(JSON.parse(text));
      await store.setJSON('players/' + m[1], clean);
      return json({ ok: true });
    }
    return json({ error: 'not_found' }, 404);
  } catch (e) {
    return json({ error: 'server' }, 500);
  }
}
