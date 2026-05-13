from datetime import datetime, timedelta
import random

def generate_timestamp(minutes_ago: int) -> str:
    t = datetime.utcnow() - timedelta(minutes=minutes_ago)
    return t.strftime("%Y-%m-%dT%H:%M:%S.000+00:00")

INCIDENTS = [
    {
        "id": "INC-001",
        "title": "Production API High Latency",
        "description": "API response times spiked above 5000ms affecting payment services",
        "severity": "critical",
        "status": "active",
        "source": "infrastructure",
        "affected_systems": ["api-gateway", "payment-service", "database"],
        "timestamp": generate_timestamp(15),
    },
    {
        "id": "INC-002",
        "title": "Suspicious Login Attempts Detected",
        "description": "Multiple failed login attempts from unknown IP addresses in Eastern Europe",
        "severity": "high",
        "status": "investigating",
        "source": "security",
        "affected_systems": ["auth-service", "user-management"],
        "timestamp": generate_timestamp(45),
    },
    {
        "id": "INC-003",
        "title": "Database Connection Pool Exhausted",
        "description": "PostgreSQL connection pool reached maximum capacity causing service degradation",
        "severity": "high",
        "status": "active",
        "source": "database",
        "affected_systems": ["postgres-primary", "order-service", "inventory-service"],
        "timestamp": generate_timestamp(8),
    },
    {
        "id": "INC-004",
        "title": "Memory Leak in Order Processing Service",
        "description": "Order service memory usage growing steadily after v2.4.1 deployment",
        "severity": "medium",
        "status": "investigating",
        "source": "application",
        "affected_systems": ["order-service"],
        "timestamp": generate_timestamp(90),
    },
    {
        "id": "INC-005",
        "title": "CDN Cache Miss Rate Spike",
        "description": "Cache miss rate jumped from 5% to 78% causing increased origin load",
        "severity": "medium",
        "status": "resolved",
        "source": "network",
        "affected_systems": ["cdn", "static-assets", "web-frontend"],
        "timestamp": generate_timestamp(180),
    },
]

LOGS = {
    "INC-001": [
        {"_time": generate_timestamp(20), "host": "api-gateway-01", "level": "WARN", "message": "Response time threshold exceeded: 2300ms", "service": "api-gateway"},
        {"_time": generate_timestamp(18), "host": "api-gateway-01", "level": "ERROR", "message": "Response time critical: 5100ms on /api/payments", "service": "api-gateway"},
        {"_time": generate_timestamp(17), "host": "payment-service-02", "level": "ERROR", "message": "Database query timeout after 3000ms", "service": "payment-service"},
        {"_time": generate_timestamp(16), "host": "postgres-primary", "level": "ERROR", "message": "Slow query detected: SELECT * FROM transactions took 4200ms", "service": "database"},
        {"_time": generate_timestamp(15), "host": "api-gateway-01", "level": "CRITICAL", "message": "Circuit breaker OPEN for payment-service", "service": "api-gateway"},
        {"_time": generate_timestamp(14), "host": "payment-service-01", "level": "ERROR", "message": "Connection pool exhausted: 100/100 connections in use", "service": "payment-service"},
        {"_time": generate_timestamp(13), "host": "monitoring", "level": "ALERT", "message": "SLA breach detected: p99 latency = 6800ms (threshold: 1000ms)", "service": "monitoring"},
    ],
    "INC-002": [
        {"_time": generate_timestamp(50), "host": "auth-service-01", "level": "WARN", "message": "Failed login attempt for user admin from IP 185.220.101.45", "service": "auth"},
        {"_time": generate_timestamp(49), "host": "auth-service-01", "level": "WARN", "message": "Failed login attempt for user admin from IP 185.220.101.45", "service": "auth"},
        {"_time": generate_timestamp(48), "host": "auth-service-01", "level": "WARN", "message": "Failed login attempt for user root from IP 185.220.101.46", "service": "auth"},
        {"_time": generate_timestamp(47), "host": "auth-service-01", "level": "ERROR", "message": "Rate limit triggered: 50 failed attempts in 3 minutes from subnet 185.220.101.0/24", "service": "auth"},
        {"_time": generate_timestamp(46), "host": "firewall-01", "level": "WARN", "message": "Port scan detected from IP 185.220.101.45", "service": "network"},
        {"_time": generate_timestamp(45), "host": "auth-service-01", "level": "CRITICAL", "message": "Possible brute force attack detected - 120 failed attempts", "service": "auth"},
    ],
    "INC-003": [
        {"_time": generate_timestamp(10), "host": "postgres-primary", "level": "WARN", "message": "Connection pool at 80% capacity: 80/100", "service": "database"},
        {"_time": generate_timestamp(9), "host": "order-service-01", "level": "ERROR", "message": "Failed to acquire database connection after 5000ms", "service": "order-service"},
        {"_time": generate_timestamp(8), "host": "postgres-primary", "level": "CRITICAL", "message": "Connection pool exhausted: 100/100 connections active", "service": "database"},
        {"_time": generate_timestamp(7), "host": "inventory-service-01", "level": "ERROR", "message": "Database unavailable - connection refused", "service": "inventory"},
        {"_time": generate_timestamp(6), "host": "order-service-02", "level": "ERROR", "message": "Order processing failed: cannot connect to database", "service": "order-service"},
    ],
    "INC-004": [
        {"_time": generate_timestamp(95), "host": "order-service-01", "level": "INFO", "message": "Deployment v2.4.1 completed successfully", "service": "order-service"},
        {"_time": generate_timestamp(85), "host": "order-service-01", "level": "WARN", "message": "Memory usage at 65%: 1.3GB/2GB", "service": "order-service"},
        {"_time": generate_timestamp(70), "host": "order-service-01", "level": "WARN", "message": "Memory usage at 78%: 1.56GB/2GB", "service": "order-service"},
        {"_time": generate_timestamp(50), "host": "order-service-01", "level": "ERROR", "message": "Memory usage at 91%: 1.82GB/2GB - GC pressure increasing", "service": "order-service"},
        {"_time": generate_timestamp(30), "host": "order-service-01", "level": "CRITICAL", "message": "Memory usage at 98%: 1.96GB/2GB - OOM imminent", "service": "order-service"},
    ],
    "INC-005": [
        {"_time": generate_timestamp(185), "host": "cdn-edge-01", "level": "WARN", "message": "Cache invalidation triggered for /static/* - 45000 objects purged", "service": "cdn"},
        {"_time": generate_timestamp(183), "host": "cdn-edge-01", "level": "ERROR", "message": "Cache miss rate: 78% (normal: 5%)", "service": "cdn"},
        {"_time": generate_timestamp(181), "host": "origin-server-01", "level": "ERROR", "message": "Origin request rate spike: 8500 req/s (normal: 450 req/s)", "service": "origin"},
        {"_time": generate_timestamp(175), "host": "cdn-edge-01", "level": "INFO", "message": "Cache warming initiated", "service": "cdn"},
        {"_time": generate_timestamp(160), "host": "cdn-edge-01", "level": "INFO", "message": "Cache miss rate normalizing: 32%", "service": "cdn"},
        {"_time": generate_timestamp(140), "host": "cdn-edge-01", "level": "INFO", "message": "Cache miss rate restored: 6%", "service": "cdn"},
    ],
}

def get_all_incidents():
    return INCIDENTS

def get_incident_by_id(incident_id: str):
    return next((i for i in INCIDENTS if i["id"] == incident_id), None)

def get_logs_for_incident(incident_id: str):
    return LOGS.get(incident_id, [])

def get_recent_errors():
    all_logs = []
    for logs in LOGS.values():
        all_logs.extend([l for l in logs if l["level"] in ("ERROR", "CRITICAL", "WARN")])
    return sorted(all_logs, key=lambda x: x["_time"], reverse=True)[:50]
