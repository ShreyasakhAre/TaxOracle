import os
import socket
import sys
import signal
import uuid

import uvicorn

LOCK_PORT = 54322
INSTANCE_ID = str(uuid.uuid4())[:8]

def _acquire_single_instance_lock() -> socket.socket | None:
    try:
        lock_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        lock_socket.bind(("127.0.0.1", LOCK_PORT))
        return lock_socket
    except OSError:
        return None

def _port_available(host: str, port: int) -> bool:
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            s.bind((host, port))
        return True
    except OSError:
        return False

def handle_exit(sig, frame):
    print(f"\n[Instance {INSTANCE_ID}] Shutting down gracefully...")
    sys.exit(0)

def main():
    signal.signal(signal.SIGINT, handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)

    lock = _acquire_single_instance_lock()
    if not lock:
        print(f"Another instance of the server is already running. (Lock on port {LOCK_PORT})")
        sys.exit(1)

    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8001"))

    while not _port_available(host, port):
        print(f"Port {port} occupied, trying next...")
        port += 1

    print(f"TaxOracle Server [Instance: {INSTANCE_ID}] running on port {port}")
    uvicorn.run("app.main:app", host=host, port=port, reload=False)

if __name__ == "__main__":
    main()
