#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { JSDOM } from 'jsdom';
import http from 'http';
import https from 'https';
import { URL } from 'url';
import fs from 'fs';
import path from 'path';

const BROWSER_SERVER_PORT = parseInt(process.env.LOCAL_BROWSER_PORT || '9222');

// ── HTTP server ──────────────────────────────────────────────
let sessions = {};
let currentSessionId = 'default';
function createSession(id) {
  sessions[id] = { id, history: [], currentIndex: -1, currentUrl: 'about:blank', currentHtml: '' };
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
      placeholder: el.getAttribute('placeholder') || ''
    })).filter(i => i.name)
  }));
  const scripts = [...doc.querySelectorAll('script[src]')].map(s => s.getAttribute('src'));
  const images = [...doc.querySelectorAll('img[src]')].map(img => ({ src: img.getAttribute('src'), alt: img.getAttribute('alt') || '' }));
  const metaTags = [...doc.querySelectorAll('meta')].map(m => ({
    name: m.getAttribute('name') || m.getAttribute('property') || '',
    content: m.getAttribute('content') || ''
  })).filter(m => m.name);
  const bodyText = doc.body.textContent.trim().substring(0, 3000);
  return { title, headings, links, forms, scripts, images, metaTags, bodyText, html: doc.documentElement.outerHTML };
}

async function navigateSession(sessionId, url) {
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
  body { margin:0 !important; padding-top:36px !important; }
  #lb-toolbar { position:fixed; top:0; left:0; right:0; height:34px; background:#1a1a2e; color:#e0e0e0; display:flex; align-items:center; padding:0 6px; font:12px/1 monospace; z-index:999999; border-bottom:2px solid #e94560; gap:4px; }
  #lb-toolbar button { background:#0f3460; color:#e0e0e0; border:none; border-radius:3px; padding:2px 8px; cursor:pointer; font:11px monospace; }
  #lb-toolbar button:hover { background:#e94560; }
  #lb-toolbar .url { flex:1; text-align:center; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; color:#aaa; font-size:11px; }
</style>
<div id="lb-toolbar">
  <button onclick="fetch('/api/go?dir=back').then(r=>location.reload())">◀</button>
  <button onclick="fetch('/api/go?dir=forward').then(r=>location.reload())">▶</button>
  <button onclick="location.reload()">⟳</button>
  <div class="url">${baseUrl || ''}</div>
</div>`;
  const idx = html.indexOf('</body>');
  if (idx !== -1) return html.slice(0, idx) + toolbar + html.slice(idx);
  return html + toolbar;
}

function startHttpServer() {
  const BROWSER_UI = `<!DOCTYPE html>
<html>
<head><title>Local Browser</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a1a;color:#e0e0e0;font:13px/1.4 monospace}
#header{background:#1a1a2e;border-bottom:2px solid #e94560;padding:6px 10px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
#header input{flex:1;min-width:150px;background:#16213e;border:1px solid #0f3460;color:#e0e0e0;padding:5px 8px;border-radius:3px;font:12px monospace}
#header button{background:#0f3460;color:#e0e0e0;border:none;border-radius:3px;padding:5px 10px;cursor:pointer;font:12px monospace}
#header button:hover{background:#e94560}
#content{display:flex;height:calc(100vh - 48px)}
#page-frame{flex:1;background:#fff}
#page-frame iframe{width:100%;height:100%;border:none}
#panel{width:380px;background:#1a1a2e;border-left:1px solid #0f3460;overflow-y:auto;padding:10px;display:none;flex-direction:column;font-size:12px}
#panel.open{display:flex}
#panel h3{color:#e94560;margin-bottom:6px;font-size:12px;text-transform:uppercase}
#panel .section{margin-bottom:12px}
#panel .item{padding:3px 0;border-bottom:1px solid #0f3460;word-break:break-all}
#panel .item a{color:#4fc3f7;text-decoration:none}
#panel .tag{color:#ffd54f}
#console-box{background:#0a0a1a;padding:6px;font-size:11px;max-height:150px;overflow-y:auto;border-top:1px solid #0f3460}
#js-row{display:flex;gap:4px;margin-top:6px}
#js-row input{flex:1;background:#16213e;border:1px solid #0f3460;color:#e0e0e0;padding:4px 6px;border-radius:3px;font:11px monospace}
#js-row button{background:#e94560;color:#fff;border:none;border-radius:3px;padding:4px 8px;cursor:pointer}
@media(max-width:700px){#content{flex-direction:column}#panel{width:100%;max-height:40vh}}
</style></head>
<body>
<div id="header">
  <button onclick="goBack()">◀</button>
  <button onclick="goForward()">▶</button>
  <button onclick="reloadPage()">⟳</button>
  <input id="url-bar" placeholder="URL or localhost:PORT" onkeydown="if(event.key==='Enter')navigate()">
  <button onclick="navigate()">Go</button>
  <button onclick="togglePanel()">🔍</button>
</div>
<div id="content">
  <div id="page-frame"><iframe id="browser-frame" sandbox="allow-scripts allow-same-origin allow-forms" src="about:blank"></iframe></div>
  <div id="panel">
    <div class="section"><h3>Page</h3><div id="page-info"></div></div>
    <div class="section"><h3>Links</h3><div id="links-list"></div></div>
    <div class="section"><h3>Forms</h3><div id="forms-list"></div></div>
    <div class="section"><h3>Console</h3><div id="console-box"></div>
      <div id="js-row"><input id="js-code" placeholder="JS..."><button onclick="runJS()">▶</button></div>
    </div>
  </div>
</div>
<script>
function navigate(u){
  const url=u||document.getElementById('url-bar').value.trim();
  if(!url)return;
  const nu=url.match(/^https?:/)?url:'http://'+url;
  document.getElementById('url-bar').value=nu;
  document.getElementById('page-frame').innerHTML='<iframe sandbox="allow-scripts allow-same-origin allow-forms" src="/proxy/'+encodeURIComponent(nu)+'"></iframe>';
  fetch('/api/navigate?url='+encodeURIComponent(nu)).then(r=>r.json()).then(d=>{if(!d.error)showInfo(d)});
}
function showInfo(d){
  document.getElementById('page-info').innerHTML='<div class="item"><span class="tag">Title:</span> '+(d.title||'')+' <span class="tag">Status:</span> '+d.status+'</div>';
  document.getElementById('links-list').innerHTML=(d.links||[]).map(l=>'<div class="item"><a href="#" onclick="navigate(\''+l.href+'\');return false">'+l.text+'</a> ('+l.href+')</div>').join('')||'<div class="item" style="color:#888">No links</div>';
  document.getElementById('forms-list').innerHTML=(d.forms||[]).map(f=>'<div class="item"><span class="tag">Form:</span> '+f.method+' '+f.action+'<br><span style="color:#888">'+(f.inputs||[]).map(i=>i.name+'('+i.type+')').join(', ')+'</span></div>').join('')||'<div class="item" style="color:#888">No forms</div>';
}
function goBack(){fetch('/api/history?dir=back').then(r=>r.json()).then(d=>{if(d.url){document.getElementById('url-bar').value=d.url;navigate(d.url)}})}
function goForward(){fetch('/api/history?dir=forward').then(r=>r.json()).then(d=>{if(d.url){document.getElementById('url-bar').value=d.url;navigate(d.url)}})}
function reloadPage(){const u=document.getElementById('url-bar').value;if(u)navigate(u)}
function togglePanel(){const p=document.getElementById('panel');p.classList.toggle('open')}
function runJS(){const c=document.getElementById('js-code').value;if(!c)return;
  fetch('/api/eval',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:c,url:document.getElementById('url-bar').value})}).then(r=>r.json()).then(d=>{
    const o=document.getElementById('console-box');
    o.innerHTML+='<div style="color:#888">> '+c+'</div><div'+(d.error?' style="color:#ef5350"':'')+'>'+JSON.stringify(d.result??d.error)+'</div>';o.scrollTop=o.scrollHeight;
  });
}
const up=new URLSearchParams(location.search).get('url');if(up){document.getElementById('url-bar').value=up;navigate(up)}
</script></body></html>`;

  const srv = http.createServer((req, res) => {
    const parsed = new URL(req.url, 'http://localhost');
    const pathname = parsed.pathname;
    const params = Object.fromEntries(parsed.searchParams);

    const sendJson = (data) => {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify(data));
    };
    const sendHtml = (html, status = 200) => {
      res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'X-Frame-Options': 'ALLOWALL' });
      res.end(html);
    };

    if (pathname === '/' || pathname === '/browser') return sendHtml(BROWSER_UI);

    if (pathname.startsWith('/proxy/')) {
      const targetUrl = decodeURIComponent(pathname.slice(7));
      if (!targetUrl) return sendHtml('Missing URL', 400);
      fetchUrl(targetUrl).then(r => sendHtml(injectToolbar(r.body, targetUrl, 'default'))).catch(e =>
        sendHtml(`<html><body style="background:#1a1a2e;color:#e94560;padding:40px;font:14px monospace"><h2>Error</h2><p>${e.message}</p></body></html>`)
      );
      return;
    }

    if (pathname === '/api/navigate') {
      if (!params.url) return sendJson({ error: 'Missing url' });
      navigateSession('default', params.url).then(r => sendJson(r)).catch(e => sendJson({ error: e.message }));
      return;
    }

    if (pathname === '/api/analyze') {
      if (!params.url) return sendJson({ error: 'Missing url' });
      fetchUrl(params.url).then(r => sendJson({ ...renderPage(r.body, params.url), status: r.status, url: params.url })).catch(e => sendJson({ error: e.message }));
      return;
    }

    if (pathname === '/api/history') {
      const s = sessions['default'];
      if (!s) return sendJson({ error: 'No session' });
      if (params.dir === 'back' && s.currentIndex > 0) {
        const entry = s.history[s.currentIndex - 1];
        return sendJson({ url: entry.url, title: entry.title, index: s.currentIndex - 1 });
      }
      if (params.dir === 'forward' && s.currentIndex < s.history.length - 1) {
        const entry = s.history[s.currentIndex + 1];
        return sendJson({ url: entry.url, title: entry.title, index: s.currentIndex + 1 });
      }
      return sendJson({ history: s.history, currentIndex: s.currentIndex });
    }

    if (pathname === '/api/eval' && req.method === 'POST') {
      let body = '';
      req.on('data', c => body += c);
      req.on('end', () => {
        try {
          const { code, url } = JSON.parse(body);
          if (!code) return sendJson({ error: 'Missing code' });
          const targetUrl = url || 'about:blank';
          fetchUrl(targetUrl).then(result => {
            const dom = new JSDOM(result.body, { url: targetUrl, runScripts: 'outside-only' });
            try {
              const r = dom.window.eval(code);
              sendJson({ result: String(r ?? null) });
            } catch (e) { sendJson({ error: e.message }); }
          }).catch(e => sendJson({ error: e.message }));
        } catch (e) { sendJson({ error: e.message }); }
      });
      return;
    }

    if (pathname === '/api/status') {
      return sendJson({
        version: '1.0.0', uptime: process.uptime(),
        memory: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB',
        session: { url: sessions['default']?.currentUrl || 'none', history: sessions['default']?.history.length || 0 }
      });
    }

    sendHtml('<h1>Local Browser</h1><p>Open <a href="/browser">/browser</a> for UI</p>');
  });

  srv.listen(BROWSER_SERVER_PORT, '0.0.0.0', () => {
    console.error(`🌐 Browser UI: http://0.0.0.0:${BROWSER_SERVER_PORT}/browser`);
  });
}

// ── MCP Server ───────────────────────────────────────────────
const TOOLS = [
  {
    name: 'navigate',
    description: 'Navigate to a URL, fetch the page, and return metadata (title, links, forms, headings, images, scripts)',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Full URL to navigate to (e.g. https://example.com or http://localhost:8081)' },
        returnBody: { type: 'boolean', description: 'Return full HTML body (default: false, returns metadata only)' }
      },
      required: ['url']
    }
  },
  {
    name: 'analyze',
    description: 'Fetch and analyze any URL without updating session history. Returns full page metadata',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL to analyze' }
      },
      required: ['url']
    }
  },
  {
    name: 'query',
    description: 'Query page content using CSS selectors. Returns text content or attributes of matching elements',
    inputSchema: {
      type: 'object',
      properties: {
        html: { type: 'string', description: 'HTML content to query (omit to use last navigated page)' },
        selector: { type: 'string', description: 'CSS selector (e.g. "h1", ".class", "#id a", "div[data-test]")' },
        attribute: { type: 'string', description: 'Attribute to extract (e.g. "href", "src", "innerHTML", "outerHTML"). Default: textContent' },
        index: { type: 'number', description: 'Index of element to extract (0-based). Default: all' }
      },
      required: ['selector']
    }
  },
  {
    name: 'execute',
    description: 'Execute JavaScript in the page DOM context (jsdom). Returns the result value',
    inputSchema: {
      type: 'object',
      properties: {
        script: { type: 'string', description: 'JavaScript code to execute' },
        url: { type: 'string', description: 'URL to load as the page context (omit to use last navigated URL)' },
        html: { type: 'string', description: 'HTML to use as page context (omit to fetch from url)' }
      },
      required: ['script']
    }
  },
  {
    name: 'click',
    description: 'Simulate clicking an element via CSS selector. Returns updated HTML state',
    inputSchema: {
      type: 'object',
      properties: {
        selector: { type: 'string', description: 'CSS selector of element to click' },
        url: { type: 'string', description: 'Page URL' },
        html: { type: 'string', description: 'HTML content (omit to use last navigated page)' }
      },
      required: ['selector']
    }
  },
  {
    name: 'fill',
    description: 'Fill a form input/textarea/select via CSS selector',
    inputSchema: {
      type: 'object',
      properties: {
        selector: { type: 'string', description: 'CSS selector of form element' },
        value: { type: 'string', description: 'Value to set' },
        url: { type: 'string', description: 'Page URL' },
        html: { type: 'string', description: 'HTML content (omit to use last navigated page)' }
      },
      required: ['selector', 'value']
    }
  },
  {
    name: 'screenshot',
    description: 'Generate a visual SVG preview of HTML content (base64 SVG image)',
    inputSchema: {
      type: 'object',
      properties: {
        html: { type: 'string', description: 'HTML content to render' },
        url: { type: 'string', description: 'URL label' }
      },
      required: ['html']
    }
  },
  {
    name: 'history',
    description: 'Get browser navigation history (back/forward)',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['list', 'back', 'forward'], description: 'History action: list, back, or forward' }
      }
    }
  },
  {
    name: 'status',
    description: 'Get browser server status including current URL and history count',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'check_links',
    description: 'Check if URLs are accessible via HEAD requests',
    inputSchema: {
      type: 'object',
      properties: {
        links: { type: 'array', items: { type: 'string' }, description: 'URLs to check' }
      },
      required: ['links']
    }
  }
];

// ── MCP tool handlers ───────────────────────────────────────
function createDOM(html, url) {
  return new JSDOM(html, { url: url || 'about:blank', contentType: 'text/html', runScripts: 'outside-only' });
}

function resolveHtml(args) {
  if (args.html) return Promise.resolve(args.html);
  const s = sessions['default'];
  if (s && s.currentHtml) return Promise.resolve(s.currentHtml);
  if (args.url) return fetchUrl(args.url).then(r => r.body);
  return Promise.reject(new Error('No HTML available. Use navigate() first or provide html/url'));
}

async function checkLink(url) {
  try {
    const parsed = new URL(url);
    const mod = parsed.protocol === 'https:' ? https : http;
    return new Promise((resolve) => {
      const req = mod.request({
        hostname: parsed.hostname, port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path: parsed.pathname + parsed.search, method: 'HEAD', timeout: 10000
      }, (res) => {
        resolve({ url, status: res.statusCode, ok: res.statusCode < 400 }); res.resume();
      });
      req.on('error', () => resolve({ url, status: 0, ok: false }));
      req.on('timeout', () => { req.destroy(); resolve({ url, status: 0, ok: false }); });
      req.end();
    });
  } catch { return { url, status: 0, ok: false }; }
}

const server = new Server({ name: 'local-browser', version: '2.0.0' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  try {
    switch (name) {
      case 'navigate': {
        const result = await navigateSession('default', args.url);
        if (result.error) throw new Error(result.error);
        const resp = {
          status: result.status,
          title: result.title,
          url: args.url,
          links: result.links,
          forms: result.forms,
          headings: result.headings,
          images: result.images,
          scripts: result.scripts,
          meta_tags: result.metaTags
        };
        if (args.returnBody) resp.body = result.html;
        return { content: [{ type: 'text', text: JSON.stringify(resp, null, 2) }] };
      }

      case 'analyze': {
        const result = await fetchUrl(args.url);
        const parsed = renderPage(result.body, args.url);
        return { content: [{ type: 'text', text: JSON.stringify({
          status: result.status, url: args.url, title: parsed.title,
          links: parsed.links, forms: parsed.forms, headings: parsed.headings,
          images: parsed.images, scripts: parsed.scripts, meta_tags: parsed.metaTags,
          body_length: result.body.length
        }, null, 2) }] };
      }

      case 'query': {
        const html = await resolveHtml(args);
        const dom = createDOM(html, args.url);
        const elements = [...dom.window.document.querySelectorAll(args.selector)];
        const selected = args.index !== undefined ? [elements[args.index]].filter(Boolean) : elements;
        const results = selected.map(el => {
          if (args.attribute === 'outerHTML') return el.outerHTML;
          if (args.attribute === 'innerHTML') return el.innerHTML;
          if (args.attribute) return el.getAttribute(args.attribute) || '';
          return el.textContent.trim();
        });
        return { content: [{ type: 'text', text: JSON.stringify({
          count: selected.length, selector: args.selector,
          results: results.slice(0, 100)
        }, null, 2) }] };
      }

      case 'execute': {
        let html;
        if (args.html) html = args.html;
        else if (args.url) { const r = await fetchUrl(args.url); html = r.body; }
        else { const s = sessions['default']; html = s?.currentHtml; }
        if (!html) throw new Error('No HTML available');
        const dom = createDOM(html, args.url || sessions['default']?.currentUrl);
        const result = dom.window.eval(args.script);
        const doc = dom.window.document;
        return { content: [{ type: 'text', text: JSON.stringify({
          result: typeof result === 'object' ? '<object>' : String(result ?? null),
          title: doc.title,
          url: doc.URL
        }, null, 2) }] };
      }

      case 'click': {
        const html = await resolveHtml(args);
        const dom = createDOM(html, args.url);
        const el = dom.window.document.querySelector(args.selector);
        if (!el) throw new Error(`Element not found: ${args.selector}`);
        const tag = el.tagName.toLowerCase();
        const text = (el.textContent || '').trim().substring(0, 100);
        el.click();
        return { content: [{ type: 'text', text: JSON.stringify({
          clicked: args.selector, tag, text,
          body_html_length: dom.window.document.body.innerHTML.length
        }, null, 2) }] };
      }

      case 'fill': {
        const html = await resolveHtml(args);
        const dom = createDOM(html, args.url);
        const el = dom.window.document.querySelector(args.selector);
        if (!el) throw new Error(`Element not found: ${args.selector}`);
        el.value = args.value;
        el.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
        el.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
        return { content: [{ type: 'text', text: JSON.stringify({
          filled: args.selector, value: args.value, tag: el.tagName.toLowerCase(),
          new_value: el.value
        }, null, 2) }] };
      }

      case 'screenshot': {
        const h = args.html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
          <rect width="800" height="600" fill="#1a1a2e"/>
          <rect x="10" y="10" width="780" height="36" rx="4" fill="#16213e" stroke="#0f3460"/>
          <text x="20" y="33" fill="#e0e0e0" font-size="13" font-family="monospace">URL: ${args.url || 'local'}</text>
          <rect x="10" y="54" width="780" height="536" rx="4" fill="#16213e" stroke="#0f3460"/>
          <foreignObject x="20" y="64" width="760" height="516">
            <div xmlns="http://www.w3.org/1999/xhtml" style="color:#e0e0e0;font-family:monospace;font-size:12px;overflow:auto;height:100%;white-space:pre-wrap;word-break:break-word">${h.substring(0, 5000)}</div>
          </foreignObject>
        </svg>`;
        return { content: [{ type: 'text', text: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}` }] };
      }

      case 'history': {
        const s = sessions['default'];
        if (!s) return { content: [{ type: 'text', text: JSON.stringify({ history: [] }) }] };
        if (args.action === 'back' && s.currentIndex > 0) {
          s.currentIndex--;
          const entry = s.history[s.currentIndex];
          const result = await navigateSession('default', entry.url);
          return { content: [{ type: 'text', text: JSON.stringify({ ...result, action: 'back', index: s.currentIndex }) }] };
        }
        if (args.action === 'forward' && s.currentIndex < s.history.length - 1) {
          s.currentIndex++;
          const entry = s.history[s.currentIndex];
          const result = await navigateSession('default', entry.url);
          return { content: [{ type: 'text', text: JSON.stringify({ ...result, action: 'forward', index: s.currentIndex }) }] };
        }
        return { content: [{ type: 'text', text: JSON.stringify({ history: s.history, currentIndex: s.currentIndex, currentUrl: s.currentUrl }) }] };
      }

      case 'status': {
        const s = sessions['default'];
        return { content: [{ type: 'text', text: JSON.stringify({
          version: '2.0.0', uptime: Math.round(process.uptime()),
          memory: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB',
          current_url: s?.currentUrl || 'none',
          history_count: s?.history.length || 0,
          ui_url: `http://0.0.0.0:${BROWSER_SERVER_PORT}/browser`
        }, null, 2) }] };
      }

      case 'check_links': {
        const results = await Promise.all(args.links.map(checkLink));
        const ok = results.filter(r => r.ok).length;
        return { content: [{ type: 'text', text: JSON.stringify({
          total: results.length, ok, failed: results.filter(r => !r.ok).length,
          details: results
        }, null, 2) }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return { content: [{ type: 'text', text: `Error: ${error.message}` }], isError: true };
  }
});

// ── Start everything ─────────────────────────────────────────
startHttpServer();

const transport = new StdioServerTransport();
await server.connect(transport);
