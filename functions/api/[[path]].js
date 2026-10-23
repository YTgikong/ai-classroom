// Cloudflare Pages Function：AI 小教室後端 API
// 取代原本在 Zeabur 上的 server/（Express + Redis）。
// 資料存在 Cloudflare KV，綁定名稱必須是 PROMPTS_KV。
// 管理密碼來自環境變數 ADMIN_PASSWORD（在 Cloudflare 設定，不會出現在網頁裡）；
// 從後台變更密碼後，新密碼的雜湊值會存在 KV，優先使用。

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function getAdminPasswordHash(env) {
  const stored = await env.PROMPTS_KV.get('admin_password_hash');
  if (stored) return stored;
  if (env.ADMIN_PASSWORD) return sha256(env.ADMIN_PASSWORD);
  return null;
}

function getToken(request) {
  const header = request.headers.get('Authorization') || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

async function isAuthed(request, env) {
  const token = getToken(request);
  return Boolean(token && (await env.PROMPTS_KV.get(`session:${token}`)));
}

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

// KV 還沒有資料時，從網站內附的備份檔載入一次（搬家時的初始資料）
async function loadPrompts(request, env) {
  const data = await env.PROMPTS_KV.get('prompts');
  if (data) return JSON.parse(data);
  const seedRes = await env.ASSETS.fetch(new URL('/data/prompts-seed.json', request.url));
  if (!seedRes.ok) return null;
  const seed = await seedRes.text();
  await env.PROMPTS_KV.put('prompts', seed);
  return JSON.parse(seed);
}

export async function onRequest({ request, env, params }) {
  if (!env.PROMPTS_KV) {
    return json({ error: '伺服器尚未設定資料庫（PROMPTS_KV）' }, 500);
  }

  const path = (params.path || []).join('/');
  const method = request.method;

  if (path === 'health' && method === 'GET') {
    return json({ ok: true });
  }

  if (path === 'prompts' && method === 'GET') {
    return json(await loadPrompts(request, env));
  }

  if (path === 'prompts' && method === 'POST') {
    if (!(await isAuthed(request, env))) return json({ error: '未登入或登入已過期' }, 401);
    const body = await readBody(request);
    await env.PROMPTS_KV.put('prompts', JSON.stringify(body));
    return json({ ok: true });
  }

  if (path === 'login' && method === 'POST') {
    const { password } = await readBody(request);
    const hash = await getAdminPasswordHash(env);
    if (!hash) return json({ error: '尚未設定管理密碼' }, 500);
    if (!password || (await sha256(password)) !== hash) {
      return json({ error: '密碼錯誤' }, 401);
    }
    const bytes = crypto.getRandomValues(new Uint8Array(24));
    const token = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
    await env.PROMPTS_KV.put(`session:${token}`, '1', { expirationTtl: SESSION_TTL_SECONDS });
    return json({ token });
  }

  if (path === 'logout' && method === 'POST') {
    const token = getToken(request);
    if (token) await env.PROMPTS_KV.delete(`session:${token}`);
    return json({ ok: true });
  }

  if (path === 'change-password' && method === 'POST') {
    if (!(await isAuthed(request, env))) return json({ error: '未登入或登入已過期' }, 401);
    const { currentPassword, newPassword } = await readBody(request);
    const hash = await getAdminPasswordHash(env);
    if (!currentPassword || !hash || (await sha256(currentPassword)) !== hash) {
      return json({ error: '目前密碼錯誤' }, 401);
    }
    if (!newPassword || newPassword.length < 6) {
      return json({ error: '新密碼至少需要 6 碼' }, 400);
    }
    await env.PROMPTS_KV.put('admin_password_hash', await sha256(newPassword));
    return json({ ok: true });
  }

  return json({ error: 'Not found' }, 404);
}
