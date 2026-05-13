from groq import Groq
from config import settings
import json

client = Groq(api_key=settings.groq_api_key)

SYSTEM_PROMPT = """You are Sentinel AI, an expert incident investigation assistant for DevOps and security teams.
You analyze operational logs, metrics, and events from Splunk to:
- Identify the root cause of incidents
- Summarize findings in plain English
- Assess business impact
- Recommend remediation actions

Always respond in structured JSON format as specified in each request.
Be concise, accurate, and actionable."""


def analyze_incident(logs: list, incident_description: str) -> dict:
    """Analyze logs and return structured incident analysis."""
    logs_text = json.dumps(logs[:20], indent=2)  # Limit to 20 events

    prompt = f"""Analyze the following incident and logs.

Incident: {incident_description}

Logs:
{logs_text}

Respond with this exact JSON structure:
{{
  "summary": "Plain English explanation of what happened",
  "root_cause": "Most likely root cause",
  "confidence": 0.0 to 1.0,
  "severity": "critical|high|medium|low",
  "affected_services": ["list of affected services"],
  "business_impact": "Impact on users and business operations",
  "timeline": ["chronological list of key events"],
  "recommendations": [
    {{"action": "action description", "priority": "immediate|short-term|long-term"}}
  ]
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        response_format={"type": "json_object"}
    )

    return json.loads(response.choices[0].message.content)


def chat_with_ai(message: str, incident_context: dict = None) -> str:
    """Conversational AI for incident Q&A."""
    context = ""
    if incident_context:
        context = f"\nCurrent incident context:\n{json.dumps(incident_context, indent=2)}\n"

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT + context},
            {"role": "user", "content": message}
        ],
        temperature=0.5
    )

    return response.choices[0].message.content
