#!/usr/bin/env node
import http from 'http';
import https from 'https';
import { URL } from 'url';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

const PORT = parseInt(process.env.LOCAL_BROWSER_PORT || '9222');
const server = http.createServer();

let sessions = {};
let currentSessionId = 'default';

function createSession(id) {
  const s = { id, history: [], currentIndex: -1, currentUrl: 'about:blank', currentHtml: '' };
  sessions[id] = s;
  return s;
}
createSession(currentSessionId);

function fetchUrl(url, method = 'GET', headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const mod = parsed.protocol === 'https:' ? https : http;
    const opts = {
      hostname: parsed.hostname, port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search, method,
      headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36', ...headers },
      timeout: 30000
    };
    const req = mod.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    if (body) req.write(body);
    req.end();
  });
}

function renderPage(html, baseUrl) {
  let dom;
  try {
    dom = new JSDOM(html, { url: baseUrl || 'about:blank', contentType: 'text/html', runScripts: 'outside-only' });
  } catch {
    dom = new JSDOM(`<html><body>${html}</body></html>`, { url: baseUrl || 'about:blank' });
  }
  const doc = dom.window.document;
  const title = doc.title || 'Untitled';
  const headings = [...doc.querySelectorAll('h1,h2,h3')].map(h => `${h.tagName}: ${h.textContent.trim()}`);
  const links = [...doc.querySelectorAll('a[href]')].slice(0, 50).map(a => ({
    href: a.getAttribute('href'), text: a.textContent.trim().substring(0, 80)
  }));
  const forms = [...doc.querySelectorAll('form')].map(f => ({
    action: f.getAttribute('action') || '', method: (f.getAttribute('method') || 'GET').toUpperCase(),
    inputs: [...f.querySelectorAll('input,select,textarea')].map(el => ({
      name: el.getAttribute('name') || '', type: el.getAttribute('type') || 'text',
      placeholder: el.getAttribute('placeholder') || '', selector: `#${el.id || ''}`
    })).filter(i => i.name)
  }));
  const bodyText = doc.body.textContent.trim().substring(0, 2000);
  return { title, headings, links, forms, bodyText, html: doc.documentElement.outerHTML };
}

async function navigate(sessionId, url) {
  const s = sessions[sessionId];
  if (!s) return { error: 'Session not found' };
  try {
    const result = await fetchUrl(url);
    const parsed = renderPage(result.body, url);
    s.currentUrl = url;
    s.currentHtml = parsed.html;
    s.history = s.history.slice(0, s.currentIndex + 1);
    s.history.push({ url, title: parsed.title });
    s.currentIndex = s.history.length - 1;
    return { ...parsed, status: result.status, canGoBack: s.currentIndex > 0, canGoForward: s.currentIndex < s.history.length - 1 };
  } catch (e) {
    return { error: e.message };
  }
}

function injectToolbar(html, baseUrl, sessionId) {
  const toolbar = `
<style>
  body { margin: 0 !important; padding-top: 40px !important; }
  #lb-toolbar { position:fixed; top:0; left:0; right:0; height:36px; background:#1a1a2e; color:#e0e0e0; display:flex; align-items:center; padding:0 8px; font:13px/1 monospace; z-index:999999; border-bottom:2px solid #e94560; }
  #lb-toolbar input { flex:1; background:#16213e; border:1px solid #0f3460; color:#e0e0e0; padding:2px 8px; border-radius:4px; margin:0 8px; height:24px; font:12px monospace; }
  #lb-toolbar button { background:#0f3460; color:#e0e0e0; border:none; border-radius:4px; padding:2px 10px; margin:0 2px; cursor:pointer; font:11px monospace; }
  #lb-toolbar button:hover { background:#e94560; }
  #lb-toolbar .url { flex:1; text-align:center; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
</style>
<div id="lb-toolbar">
  <button onclick="goBack()">◀</button>
  <button onclick="goForward()">▶</button>
  <button onclick="goReload()">⟳</button>
  <div class="url" id="lb-url">${baseUrl || ''}</div>
  <button onclick="showInspector()">🔍</button>
</div>
<script>
  function goBack() { fetch('/api/navigate?url='+encodeURIComponent(document.getElementById('lb-url').textContent)+'&dir=back&session=${sessionId}').then(r=>r.json()).then(d=>{if(!d.error)location.reload()}); }
  function goForward() { fetch('/api/navigate?url='+encodeURIComponent(document.getElementById('lb-url').textContent)+'&dir=forward&session=${sessionId}').then(r=>r.json()).then(d=>{if(!d.error)location.reload()}); }
  function goReload() { location.reload(); }
  function showInspector() { alert('Open: /api/inspect?session=${sessionId}'); }
</script>
`;
  const idx = html.indexOf('</body>');
  if (idx !== -1) return html.slice(0, idx) + toolbar + html.slice(idx);
  return html + toolbar;
}

function parseQuery(url) {
  const parsed = new URL(url, 'http://localhost');
  const params = {};
  for (const [k, v] of parsed.searchParams) params[k] = v;
  return params;
}

function serveStatic(res, content, type = 'text/html; charset=utf-8') {
  res.writeHead(200, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE', 'Access-Control-Allow-Headers': 'Content-Type' });
  res.end(content);
}

function serveApiJson(res, data) {
  res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function serveError(res, msg, status = 400) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify({ error: msg }));
}

const BROWSER_UI = `<!DOCTYPE html>
<html>
<head><title>Local Browser</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#0a0a1a; color:#e0e0e0; font:14px/1.4 monospace; }
  #header { background:#1a1a2e; border-bottom:2px solid #e94560; padding:8px 12px; display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  #header input { flex:1; min-width:200px; background:#16213e; border:1px solid #0f3460; color:#e0e0e0; padding:6px 10px; border-radius:4px; font:13px monospace; }
  #header button { background:#0f3460; color:#e0e0e0; border:none; border-radius:4px; padding:6px 14px; cursor:pointer; font:13px monospace; }
  #header button:hover { background:#e94560; }
  #nav-buttons { display:flex; gap:2px; }
  .nav-btn { padding:6px 10px !important; }
  #content { display:flex; height:calc(100vh - 56px); }
  #page-frame { flex:1; background:#fff; }
  #page-frame iframe { width:100%; height:100%; border:none; }
  #panel { width:400px; background:#1a1a2e; border-left:1px solid #0f3460; overflow-y:auto; padding:12px; display:none; flex-direction:column; }
  #panel.open { display:flex; }
  #panel h3 { color:#e94560; margin-bottom:8px; font-size:13px; text-transform:uppercase; }
  #panel .section { margin-bottom:16px; }
  #panel .item { padding:4px 0; border-bottom:1px solid #0f3460; font-size:12px; word-break:break-all; }
  #panel .item a { color:#4fc3f7; text-decoration:none; }
  #panel .item a:hover { text-decoration:underline; }
  #panel .tag { color:#ffd54f; }
  #status-bar { background:#16213e; padding:4px 12px; font-size:11px; color:#888; display:flex; justify-content:space-between; }
  #console-output { background:#0a0a1a; padding:8px; font-size:11px; max-height:200px; overflow-y:auto; border-top:1px solid #0f3460; }
  .console-line { padding:2px 0; }
  .console-line.error { color:#ef5350; }
  .console-line.log { color:#e0e0e0; }
  #js-input { display:flex; gap:4px; margin-top:8px; }
  #js-input input { flex:1; background:#16213e; border:1px solid #0f3460; color:#e0e0e0; padding:6px 8px; border-radius:4px; font:12px monospace; }
  #js-input button { background:#e94560; color:#fff; border:none; border-radius:4px; padding:6px 12px; cursor:pointer; }
  @media (max-width:700px) {
    #content { flex-direction:column; }
    #panel { width:100%; max-height:50vh; }
  }
</style>
</head>
<body>
<div id="header">
  <div id="nav-buttons">
    <button class="nav-btn" onclick="goBack()">◀</button>
    <button class="nav-btn" onclick="goForward()">▶</button>
    <button class="nav-btn" onclick="reloadPage()">⟳</button>
  </div>
  <input id="url-bar" value="" placeholder="Enter URL or localhost:PORT..." onkeydown="if(event.key==='Enter')navigate()">
  <button onclick="navigate()">Go</button>
  <button onclick="togglePanel()" id="panel-toggle">📋 Info</button>
</div>
<div id="content">
  <div id="page-frame"><iframe id="browser-frame" sandbox="allow-scripts allow-same-origin allow-forms" src="about:blank"></iframe></div>
  <div id="panel">
    <div class="section"><h3>Page Info</h3><div id="page-info"></div></div>
    <div class="section"><h3>Links</h3><div id="links-list"></div></div>
    <div class="section"><h3>Forms</h3><div id="forms-list"></div></div>
    <div class="section"><h3>Console</h3><div id="console-output"></div>
      <div id="js-input"><input id="js-code" placeholder="JavaScript..."><button onclick="runJS()">▶</button></div>
    </div>
  </div>
</div>
<div id="status-bar"><span id="status-url"></span><span id="status-links"></span></div>
<script>
  let session = 'default';
  let isPanelOpen = false;

  function navigate(url) {
    const u = url || document.getElementById('url-bar').value.trim();
    if (!u) return;
    const useUrl = u.match(/^https?:/) ? u : 'http://' + u;
    document.getElementById('url-bar').value = useUrl;
    document.getElementById('page-frame').innerHTML = '<iframe id="browser-frame" sandbox="allow-scripts allow-same-origin allow-forms" src="/proxy/' + encodeURIComponent(useUrl) + '?session=' + session + '"></iframe>';
    document.getElementById('status-url').textContent = useUrl;
    fetchPageInfo(useUrl);
  }

  function fetchPageInfo(url) {
    fetch('/api/analyze?url=' + encodeURIComponent(url) + '&session=' + session)
      .then(r => r.json()).then(d => {
        if (d.error) return;
        document.getElementById('page-info').innerHTML = '<div class="item"><span class="tag">Title:</span> ' + (d.title||'') + '</div><div class="item"><span class="tag">Status:</span> ' + (d.status||'') + '</div>';
        const linksHtml = (d.links||[]).map(l => '<div class="item"><a href="#" onclick="navigate(\''+l.href+'\');return false">' + l.text + '</a> <span style="color:#888">(' + l.href + ')</span></div>').join('');
        document.getElementById('links-list').innerHTML = linksHtml || '<div class="item" style="color:#888">No links found</div>';
        document.getElementById('status-links').textContent = (d.links||[]).length + ' links';
        const formsHtml = (d.forms||[]).map(f => '<div class="item"><span class="tag">Form:</span> ' + f.method + ' ' + f.action + '<br><span style="color:#888">' + (f.inputs||[]).map(i => i.name + '(' + i.type + ')').join(', ') + '</span></div>').join('');
        document.getElementById('forms-list').innerHTML = formsHtml || '<div class="item" style="color:#888">No forms</div>';
      }).catch(e => {});
  }

  function goBack() {
    fetch('/api/history?dir=back&session=' + session).then(r=>r.json()).then(d => {
      if (d.url) { document.getElementById('url-bar').value = d.url; navigate(d.url); }
    });
  }

  function goForward() {
    fetch('/api/history?dir=forward&session=' + session).then(r=>r.json()).then(d => {
      if (d.url) { document.getElementById('url-bar').value = d.url; navigate(d.url); }
    });
  }

  function reloadPage() {
    const url = document.getElementById('url-bar').value;
    if (url) navigate(url);
  }

  function togglePanel() {
    isPanelOpen = !isPanelOpen;
    document.getElementById('panel').classList.toggle('open', isPanelOpen);
    document.getElementById('panel-toggle').textContent = isPanelOpen ? '✕ Close' : '📋 Info';
  }

  function runJS() {
    const code = document.getElementById('js-code').value;
    if (!code) return;
    fetch('/api/eval', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({code, session, url: document.getElementById('url-bar').value}) })
      .then(r=>r.json()).then(d => {
        const out = document.getElementById('console-output');
        out.innerHTML += '<div class="console-line log">> ' + code + '</div>';
        out.innerHTML += '<div class="console-line' + (d.error ? ' error' : '') + '">' + JSON.stringify(d.result ?? d.error) + '</div>';
        out.scrollTop = out.scrollHeight;
      });
  }

  // Auto-navigate if URL in query param
  const urlParam = new URLSearchParams(location.search).get('url');
  if (urlParam) { document.getElementById('url-bar').value = urlParam; navigate(urlParam); }
</script>
</body>
</html>`;

server.on('request', async (req, res) => {
  const parsed = new URL(req.url, 'http://localhost');
  const pathname = parsed.pathname;
  const params = Object.fromEntries(parsed.searchParams);

  if (pathname === '/' || pathname === '/browser') {
    return serveStatic(res, BROWSER_UI);
  }

  if (pathname === '/proxy') {
    const targetUrl = params.url;
    if (!targetUrl) return serveError(res, 'Missing url param');
    try {
      const result = await fetchUrl(targetUrl);
      const proxied = injectToolbar(result.body, targetUrl, params.session || 'default');
      res.writeHead(result.status, { 'Content-Type': 'text/html; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'X-Frame-Options': 'ALLOWALL' });
      res.end(proxied);
    } catch (e) {
      serveStatic(res, `<html><body style="background:#1a1a2e;color:#e94560;padding:40px;font:14px monospace"><h2>Error loading ${targetUrl}</h2><p>${e.message}</p></body></html>`);
    }
    return;
  }

  if (pathname === '/api/navigate') {
    const url = params.url;
    if (!url) return serveError(res, 'Missing url');
    const sid = params.session || 'default';
    const s = sessions[sid];
    if (!s) return serveError(res, 'Invalid session');
    if (params.dir === 'back' && s.currentIndex > 0) {
      s.currentIndex--;
      const entry = s.history[s.currentIndex];
      const result = await navigate(sid, entry.url);
      return serveApiJson(res, result);
    }
    if (params.dir === 'forward' && s.currentIndex < s.history.length - 1) {
      s.currentIndex++;
      const entry = s.history[s.currentIndex];
      const result = await navigate(sid, entry.url);
      return serveApiJson(res, result);
    }
    const result = await navigate(sid, url);
    return serveApiJson(res, result);
  }

  if (pathname === '/api/analyze') {
    const url = params.url;
    if (!url) return serveError(res, 'Missing url');
    try {
      const result = await fetchUrl(url);
      const parsed = renderPage(result.body, url);
      return serveApiJson(res, { ...parsed, status: result.status, url });
    } catch (e) {
      return serveApiJson(res, { error: e.message });
    }
  }

  if (pathname === '/api/history') {
    const sid = params.session || 'default';
    const s = sessions[sid];
    if (!s) return serveError(res, 'Invalid session');
    if (params.dir === 'back' && s.currentIndex > 0) {
      const entry = s.history[s.currentIndex - 1];
      return serveApiJson(res, { url: entry.url, title: entry.title, index: s.currentIndex - 1 });
    }
    if (params.dir === 'forward' && s.currentIndex < s.history.length - 1) {
      const entry = s.history[s.currentIndex + 1];
      return serveApiJson(res, { url: entry.url, title: entry.title, index: s.currentIndex + 1 });
    }
    return serveApiJson(res, { history: s.history, currentIndex: s.currentIndex });
  }

  if (pathname === '/api/eval' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const { code, url, session: sid } = JSON.parse(body);
        if (!code) return serveError(res, 'Missing code');
        sid && createSession(sid);
        const targetUrl = url || 'about:blank';
        fetchUrl(targetUrl).then(result => {
          const dom = new JSDOM(result.body, { url: targetUrl, runScripts: 'outside-only' });
          try {
            const r = dom.window.eval(code);
            return serveApiJson(res, { result: String(r ?? null) });
          } catch (e) {
            return serveApiJson(res, { error: e.message });
          }
        }).catch(e => serveApiJson(res, { error: e.message }));
      } catch (e) { serveError(res, e.message); }
    });
    return;
  }

  if (pathname === '/api/sessions') {
    return serveApiJson(res, Object.keys(sessions));
  }

  if (pathname === '/api/status') {
    return serveApiJson(res, {
      version: '1.0.0', uptime: process.uptime(),
      sessions: Object.keys(sessions).length,
      currentSession: currentSessionId,
      memory: process.memoryUsage().rss
    });
  }

  if (pathname === '/api/screenshot' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const { html, url } = JSON.parse(body);
        const h = (html || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
          <rect width="800" height="600" fill="#1a1a2e"/>
          <rect x="10" y="10" width="780" height="40" rx="5" fill="#16213e" stroke="#0f3460"/>
          <text x="20" y="35" fill="#e0e0e0" font-size="14">URL: ${url || 'local'}</text>
          <rect x="10" y="60" width="780" height="530" rx="5" fill="#16213e" stroke="#0f3460"/>
          <foreignObject x="20" y="70" width="760" height="510">
            <div xmlns="http://www.w3.org/1999/xhtml" style="color:#e0e0e0;font-family:monospace;font-size:12px;overflow:auto;height:100%;white-space:pre-wrap;word-break:break-word">${h.substring(0, 5000)}</div>
          </foreignObject>
        </svg>`;
        return serveApiJson(res, { screenshot: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}` });
      } catch (e) { serveError(res, e.message); }
    });
    return;
  }

  serveStatic(res, '<h1>Local Browser Server</h1><p>Open <a href="/browser">/browser</a> for the UI</p>');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Local Browser Server running on http://0.0.0.0:${PORT}`);
  console.log(`  UI: http://localhost:${PORT}/browser`);
  console.log(`  API: http://localhost:${PORT}/api/status`);
});
