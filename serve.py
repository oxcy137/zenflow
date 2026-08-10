import http.server
import socketserver
import mimetypes
import os

mimetypes.add_type('application/vnd.android.package-archive', '.apk')

os.chdir(os.path.join(os.path.dirname(__file__), 'serve'))

PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"Server on http://0.0.0.0:{PORT}")
    print(f"Download: http://192.168.1.40:{PORT}/ZenFlow.apk")
    httpd.serve_forever()
