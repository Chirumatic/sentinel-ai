import asyncio
import random
from datetime import datetime, timedelta

# Pool of realistic incident templates
INCIDENT_TEMPLATES = [
    {
        "title": "CPU Spike on Production Server",
        "description": "CPU usage exceeded 95% on prod-server-01 causing request timeouts",
        "severity": "critical",
        "source": "infrastructure",
        "affected_systems": ["prod-server-01", "api-gateway", "load-balancer"],
    },
    {
        "title": "Unauthorized Access Attempt Detected",
        "description": "Multiple failed SSH login attempts from IP 192.168.1.45 on bastion host",
        "severity": "high",
        "source": "security",
        "affected_systems": ["bastion-host", "auth-service"],
    },
    {
        "title": "Redis Cache Connection Failure",
        "description": "Redis cluster is unreachable causing cache misses and increased DB load",
        "severity": "high",
        "source": "infrastructure",
        "affected_systems": ["redis-cluster", "session-service", "api-gateway"],
    },
    {
        "title": "SSL Certificate Expiring Soon",
        "description": "SSL certificate for api.example.com expires in 3 days",
        "severity": "medium",
        "source": "infrastructure",
        "affected_systems": ["api-gateway", "web-frontend"],
    },
    {
        "title": "Kubernetes Pod OOMKilled",
        "description": "Order processing pod killed due to out-of-memory error after traffic spike",
        "severity": "critical",
        "source": "infrastructure",
        "affected_systems": ["k8s-order-pod", "order-service", "payment-service"],
    },
    {
        "title": "SQL Injection Attempt Blocked",
        "description": "WAF blocked 47 SQL injection attempts targeting /api/users endpoint",
        "severity": "high",
        "source": "security",
        "affected_systems": ["waf", "user-service", "postgres-primary"],
    },
    {
        "title": "Disk Space Critical on DB Server",
        "description": "Disk usage at 94% on postgres-primary — write operations may fail soon",
        "severity": "critical",
        "source": "database",
        "affected_systems": ["postgres-primary", "order-service", "analytics-service"],
    },
    {
        "title": "Third-Party Payment API Degraded",
        "description": "Stripe API response times averaging 8000ms — payment processing affected",
        "severity": "high",
        "source": "application",
        "affected_systems": ["payment-service", "checkout-service"],
    },
    {
        "title": "Network Packet Loss Detected",
        "description": "15% packet loss between us-east-1 and eu-west-1 regions",
        "severity": "medium",
        "source": "network",
        "affected_systems": ["network-backbone", "cdn", "api-gateway"],
    },
    {
        "title": "Anomalous Data Exfiltration Pattern",
        "description": "Unusual outbound data transfer of 2.3GB detected from internal server",
        "severity": "critical",
        "source": "security",
        "affected_systems": ["data-server-03", "firewall", "dlp-system"],
    },
    {
        "title": "Message Queue Backlog Growing",
        "description": "RabbitMQ queue depth exceeded 50,000 messages — consumers falling behind",
        "severity": "medium",
        "source": "application",
        "affected_systems": ["rabbitmq", "worker-service", "notification-service"],
    },
    {
        "title": "Load Balancer Health Check Failures",
        "description": "3 of 6 backend instances failing health checks — traffic redistributed",
        "severity": "high",
        "source": "infrastructure",
        "affected_systems": ["load-balancer", "api-server-02", "api-server-04", "api-server-06"],
    },
]


def generate_timestamp(minutes_ago: int = 0) -> str:
    t = datetime.utcnow() - timedelta(minutes=minutes_ago)
    return t.strftime("%Y-%m-%dT%H:%M:%S.000+00:00")


async def run_simulator(incidents_list: list, interval_seconds: int = 45):
    """
    Continuously adds new incidents to the shared incidents list.
    Picks a random template every `interval_seconds` seconds.
    """
    used = set(i["title"] for i in incidents_list)

    while True:
        await asyncio.sleep(interval_seconds)

        # Pick a template not already active
        available = [t for t in INCIDENT_TEMPLATES if t["title"] not in used]
        if not available:
            # Reset used pool when all templates exhausted
            used = set()
            available = INCIDENT_TEMPLATES

        template = random.choice(available)
        used.add(template["title"])

        new_inc = {
            "id": f"INC-{len(incidents_list) + 1:03d}",
            "title": template["title"],
            "description": template["description"],
            "severity": template["severity"],
            "status": random.choice(["active", "active", "investigating"]),
            "source": template["source"],
            "affected_systems": template["affected_systems"],
            "timestamp": generate_timestamp(0),
        }

        incidents_list.append(new_inc)
        print(f"[Simulator] New incident: {new_inc['id']} — {new_inc['title']}")
