from datetime import datetime


def get_health():
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat()
    }
