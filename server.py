import http.server
import urllib.request
import urllib.error
import sys

PORT = 8080
LM_STUDIO_URL = "http://127.0.0.1:1234"

import os
import json

SAVES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "saves")
if not os.path.exists(SAVES_DIR):
    os.makedirs(SAVES_DIR)

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/saves":
            saves_data = []
            if os.path.exists(SAVES_DIR):
                for filename in os.listdir(SAVES_DIR):
                    if filename.endswith(".json") and filename.startswith("character_"):
                        filepath = os.path.join(SAVES_DIR, filename)
                        try:
                            with open(filepath, "r", encoding="utf-8") as f:
                                data = json.load(f)
                                saves_data.append(data)
                        except Exception as e:
                            print(f"Error loading save file {filename}: {e}", file=sys.stderr)
            
            resp_bytes = json.dumps(saves_data).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(resp_bytes)))
            self.end_headers()
            self.wfile.write(resp_bytes)
            return

        if self.path.startswith("/proxy/"):
            self.proxy_request("GET")
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == "/api/saves":
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else b""
            try:
                save_data = json.loads(body.decode("utf-8"))
                char_id = save_data.get("player", {}).get("id")
                if not char_id:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b"Missing player ID in save data.")
                    return
                
                filename = f"character_{char_id}.json"
                filepath = os.path.join(SAVES_DIR, filename)
                with open(filepath, "w", encoding="utf-8") as f:
                    json.dump(save_data, f, indent=2)
                
                self.send_response(200)
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(b"Saved successfully.")
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode("utf-8"))
            return

        if self.path == "/api/saves/delete":
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else b""
            try:
                payload = json.loads(body.decode("utf-8"))
                char_id = payload.get("id")
                if not char_id:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b"Missing character ID.")
                    return
                
                filename = f"character_{char_id}.json"
                filepath = os.path.join(SAVES_DIR, filename)
                if os.path.exists(filepath):
                    os.remove(filepath)
                    self.send_response(200)
                else:
                    self.send_response(404)
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode("utf-8"))
            return

        if self.path.startswith("/proxy/"):
            self.proxy_request("POST")
        else:
            self.send_error(405, "Method not allowed")

    def do_OPTIONS(self):
        # Always allow CORS for preflight requests
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def proxy_request(self, method):
        # Extract target path: /proxy/v1/models -> /v1/models
        target_path = self.path[len("/proxy"):]
        url = LM_STUDIO_URL + target_path
        
        # Read request body for POST completions
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else None
        
        # Filter headers to avoid conflicts
        headers = {}
        for key, val in self.headers.items():
            if key.lower() not in ['host', 'connection', 'accept-encoding']:
                headers[key] = val

        req = urllib.request.Request(url, data=body, headers=headers, method=method)
        
        try:
            with urllib.request.urlopen(req) as response:
                self.send_response(response.status)
                for key, val in response.getheaders():
                    if key.lower() not in ['transfer-encoding', 'content-length']:
                        self.send_header(key, val)
                
                resp_data = response.read()
                self.send_header("Content-Length", str(len(resp_data)))
                self.end_headers()
                self.wfile.write(resp_data)
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            for key, val in e.headers.items():
                if key.lower() not in ['transfer-encoding', 'content-length']:
                    self.send_header(key, val)
            resp_data = e.read()
            self.send_header("Content-Length", str(len(resp_data)))
            self.end_headers()
            self.wfile.write(resp_data)
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode('utf-8'))

if __name__ == "__main__":
    import socket

    def get_local_ips():
        ips = ["127.0.0.1"]
        try:
            # Primary method to detect active network interface IP
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.settimeout(0.5)
            s.connect(("8.8.8.8", 80))
            primary_ip = s.getsockname()[0]
            s.close()
            if primary_ip not in ips:
                ips.append(primary_ip)
        except Exception:
            pass

        try:
            # Fallback method to list other interface IPs
            hostname = socket.gethostname()
            for ip in socket.gethostbyname_ex(hostname)[2]:
                if ip not in ips and not ip.startswith("127."):
                    ips.append(ip)
        except Exception:
            pass
        return ips

    server_address = ('', PORT)
    httpd = http.server.HTTPServer(server_address, ProxyHTTPRequestHandler)
    
    local_ips = get_local_ips()
    primary_local_ip = local_ips[1] if len(local_ips) > 1 else "127.0.0.1"

    print("=======================================================================")
    print("  Proxy Web Server is running!")
    print(f"  Local access (on this PC):      http://localhost:{PORT}")
    if primary_local_ip != "127.0.0.1":
        print(f"  Local network access (Wi-Fi):  http://{primary_local_ip}:{PORT}")
        if len(local_ips) > 2:
            print("  Other network interfaces:")
            for extra_ip in local_ips[2:]:
                print(f"    http://{extra_ip}:{PORT}")
    print("=======================================================================")
    print("  To share this game online over the public internet, you can run:")
    print("  ssh -o StrictHostKeyChecking=no -R 80:localhost:8080 nokey@localhost.run")
    print("=======================================================================")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nExiting server.")
        sys.exit(0)
