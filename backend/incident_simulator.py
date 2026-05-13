import asyncio
import random
from datetime import datetime, timedelta

INCIDENT_TEMPLATES = [
    {"title": "CPU Spike on Production Server", "description": "CPU usage exceeded 95% on prod-server-01 causing request timeouts", "severity": "critical", "source": "infrastructure", "affected_systems": ["prod-server-01", "api-gateway", "load-balancer"]},
    {"title": "Unauthorized Access Attempt Detected", "description": "Multiple failed SSH login attempts from IP 192.168.1.45 on bastion host", "severity": "high", "source": "security", "affected_systems": ["bastion-host", "auth-service"]},
    {"title": "Redis Cache Connection Failure", "description": "Redis cluster is unreachable causing cache misses and increased DB load", "severity": "high", "source": "infrastructure", "affected_systems": ["redis-cluster", "session-service", "api-gateway"]},
    {"title": "SSL Certificate Expiring Soon", "description": "SSL certificate for api.example.com expires in 3 days", "severity": "medium", "source": "infrastructure", "affected_systems": ["api-gateway", "web-frontend"]},
    {"title": "Kubernetes Pod OOMKilled", "description": "Order processing pod killed due to out-of-memory error after traffic spike", "severity": "critical", "source": "infrastructure", "affected_systems": ["k8s-order-pod", "order-service", "payment-service"]},
    {"title": "SQL Injection Attempt Blocked", "description": "WAF blocked 47 SQL injection attempts targeting /api/users endpoint", "severity": "high", "source": "security", "affected_systems": ["waf", "user-service", "postgres-primary"]},
    {"title": "Disk Space Critical on DB Server", "description": "Disk usage at 94% on postgres-primary — write operations may fail soon", "severity": "critical", "source": "database", "affected_systems": ["postgres-primary", "order-service", "analytics-service"]},
    {"title": "Third-Party Payment API Degraded", "description": "Stripe API response times averaging 8000ms — payment processing affected", "severity": "high", "source": "application", "affected_systems": ["payment-service", "checkout-service"]},
    {"title": "Network Packet Loss Detected", "description": "15% packet loss between us-east-1 and eu-west-1 regions", "severity": "medium", "source": "network", "affected_systems": ["network-backbone", "cdn", "api-gateway"]},
    {"title": "Anomalous Data Exfiltration Pattern", "description": "Unusual outbound data transfer of 2.3GB detected from internal server", "severity": "critical", "source": "security", "affected_systems": ["data-server-03", "firewall", "dlp-system"]},
    {"title": "Message Queue Backlog Growing", "description": "RabbitMQ queue depth exceeded 50,000 messages — consumers falling behind", "severity": "medium", "source": "application", "affected_systems": ["rabbitmq", "worker-service", "notification-service"]},
    {"title": "Load Balancer Health Check Failures", "description": "3 of 6 backend instances failing health checks — traffic redistributed", "severity": "high", "source": "infrastructure", "affected_systems": ["load-balancer", "api-server-02", "api-server-04", "api-server-06"]},
]

INCIDENT_LOGS = {
    "CPU Spike on Production Server": [
        {"level": "WARN", "message": "CPU usage at 78% on prod-server-01", "service": "monitoring"},
        {"level": "ERROR", "message": "CPU usage critical: 95% on prod-server-01", "service": "monitoring"},
        {"level": "ERROR", "message": "Request timeout after 5000ms on api-gateway", "service": "api-gateway"},
        {"level": "CRITICAL", "message": "Load average exceeded threshold: 24.5 (limit: 8.0)", "service": "monitoring"},
    ],
    "Unauthorized Access Attempt Detected": [
        {"level": "WARN", "message": "Failed SSH login from IP 192.168.1.45 for user root", "service": "auth"},
        {"level": "WARN", "message": "Failed SSH login from IP 192.168.1.45 for user admin", "service": "auth"},
        {"level": "ERROR", "message": "Rate limit triggered: 30 failed attempts in 2 minutes", "service": "auth"},
        {"level": "CRITICAL", "message": "Possible brute force attack from 192.168.1.45 — blocking IP", "service": "security"},
    ],
    "Redis Cache Connection Failure": [
        {"level": "WARN", "message": "Redis connection timeout after 1000ms", "service": "cache"},
        {"level": "ERROR", "message": "Redis cluster unreachable — falling back to DB", "service": "session-service"},
        {"level": "ERROR", "message": "Cache miss rate: 98% (normal: 5%)", "service": "cache"},
        {"level": "CRITICAL", "message": "Session service degraded — Redis unavailable", "service": "session-service"},
    ],
    "Kubernetes Pod OOMKilled": [
        {"level": "WARN", "message": "Pod memory usage at 85%: 1.7GB/2GB", "service": "k8s"},
        {"level": "ERROR", "message": "Pod memory usage at 98%: 1.96GB/2GB", "service": "k8s"},
        {"level": "CRITICAL", "message": "OOMKilled: pod order-processor-7d9f terminated", "service": "k8s"},
        {"level": "ERROR", "message": "Order processing unavailable — pod restarting", "service": "order-service"},
    ],
    "Disk Space Critical on DB Server": [
        {"level": "WARN", "message": "Disk usage at 80% on postgres-primary", "service": "database"},
        {"level": "ERROR", "message": "Disk usage at 94% — write operations may fail", "service": "database"},
        {"level": "CRITICAL", "message": "WAL archiving failed — disk full", "service": "database"},
    ],
    "SQL Injection Attempt Blocked": [
        {"level": "WARN", "message": "Suspicious query pattern detected on /api/users", "service": "waf"},
        {"level": "ERROR", "message": "SQL injection attempt blocked: ' OR 1=1 --", "service": "waf"},
        {"level": "CRITICAL", "message": "47 injection attempts in 60 seconds from 203.0.113.42", "service": "waf"},
    ],
    "Third-Party Payment API Degraded": [
        {"level": "WARN", "message": "Stripe API response time: 3200ms (threshold: 1000ms)", "service": "payment"},
        {"level": "ERROR", "message": "Stripe API response time: 8000ms — timeout imminent", "service": "payment"},
        {"level": "ERROR", "message": "Payment processing failure rate: 23%", "service": "checkout"},
    ],
    "Network Packet Loss Detected": [
        {"level": "WARN", "message": "Packet loss 5% detected on us-east-1 to eu-west-1 link", "service": "network"},
        {"level": "ERROR", "message": "Packet loss increased to 15% — latency spike 450ms", "service": "network"},
        {"level": "ERROR", "message": "CDN origin requests failing intermittently", "service": "cdn"},
    ],
    "Anomalous Data Exfiltration Pattern": [
        {"level": "WARN", "message": "Unusual outbound traffic: 500MB in 10 minutes from data-server-03", "service": "dlp"},
        {"level": "ERROR", "message": "Data transfer threshold exceeded: 2.3GB outbound", "service": "dlp"},
        {"level": "CRITICAL", "message": "Possible data exfiltration — blocking outbound on data-server-03", "service": "firewall"},
    ],
    "Message Queue Backlog Growing": [
        {"level": "WARN", "message": "RabbitMQ queue depth: 10,000 messages", "service": "rabbitmq"},
        {"level": "ERROR", "message": "RabbitMQ queue depth: 50,000 messages — consumers lagging", "service": "rabbitmq"},
        {"level": "ERROR", "message": "Notification delivery delayed by 15 minutes", "service": "notification-service"},
    ],
    "Load Balancer Health Check Failures": [
        {"level": "WARN", "message": "api-server-02 health check failed — removing from pool", "service": "load-balancer"},
        {"level": "ERROR", "message": "api-server-04 health check failed — 2 of 6 instances down", "service": "load-balancer"},
        {"level": "CRITICAL", "message": "3 of 6 instances unhealthy — traffic redistributed to 3 nodes", "service": "load-balancer"},
    ],
    "SSL Certificate Expiring Soon": [
        {"level": "WARN", "message": "SSL certificate for api.example.com expires in 3 days", "service": "ssl-monitor"},
        {"level": "WARN", "message": "Auto-renewal failed — manual intervention required", "service": "ssl-monitor"},
    ],
}


def generate_timestamp(minutes_ago: int = 0) -> str:
    t = datetime.utcnow() - timedelta(minutes=minutes_ago)
    return t.strftime("%Y-%m-%dT%H:%M:%S.000+00:00")


async def run_simulator(incidents_list: list, logs_dict: dict, interval_seconds: int = 45):
    used = set(i["title"] for i in incidents_list)

    while True:
        await asyncio.sleep(interval_seconds)

        available = [t for t in INCIDENT_TEMPLATES if t["title"] not in used]
        if not available:
            used = set()
            available = INCIDENT_TEMPLATES

        template = random.choice(available)
        used.add(template["title"])

        new_id = f"INC-{len(incidents_list) + 1:03d}"
        new_inc = {
            "id": new_id,
            "title": template["title"],
            "description": template["description"],
            "severity": template["severity"],
            "status": random.choice(["active", "active", "investigating"]),
            "source": template["source"],
            "affected_systems": template["affected_systems"],
            "timestamp": generate_timestamp(0),
        }

        # Attach logs
        template_logs = INCIDENT_LOGS.get(template["title"], [])
        logs_dict[new_id] = [
            {**log, "_time": generate_timestamp(random.randint(0, 5)), "host": template["affected_systems"][0]}
            for log in template_logs
        ]

        incidents_list.append(new_inc)
        print(f"[Simulator] New incident: {new_id} — {new_inc['title']}")
