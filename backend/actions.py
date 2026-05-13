from datetime import datetime
from typing import Optional

# In-memory audit log (replace with DB in production)
audit_log: list[dict] = []

def get_audit_log():
    return sorted(audit_log, key=lambda x: x["timestamp"], reverse=True)

def record_action(
    incident_id: str,
    action: str,
    decision: str,  # "approved" | "rejected"
    approved_by: str,
    reason: Optional[str] = None,
    priority: Optional[str] = None,
):
    entry = {
        "id": f"ACT-{len(audit_log) + 1:03d}",
        "incident_id": incident_id,
        "action": action,
        "priority": priority or "unknown",
        "decision": decision,
        "approved_by": approved_by,
        "reason": reason or "",
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
    audit_log.append(entry)
    return entry
