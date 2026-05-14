# Sentinel AI — Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SENTINEL AI PLATFORM                            │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React.js)                            │
│                     Deployed on Vercel                                  │
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │
│  │  Incident   │  │  AI Analysis│  │  Analytics  │  │    Voice     │  │
│  │  Dashboard  │  │   Panel     │  │  & Charts   │  │  Assistant   │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │
│  │  AI Chat    │  │  Audit Log  │  │  Activity   │  │   Settings   │  │
│  │  Assistant  │  │  (HITL)     │  │    Feed     │  │    Page      │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────────────┘  │
└────────────────────────────┬────────────────────────────────────────────┘
                             │ REST API (HTTPS)
                             │ Auto-refresh every 30s
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (FastAPI / Python)                       │
│                         Deployed on Render                              │
│                                                                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  Incident API    │  │   AI Orchestrator│  │  Action Approval API │  │
│  │  /api/incidents  │  │  /api/ai/analyze │  │  /api/actions/decide │  │
│  └──────────────────┘  └────────┬─────────┘  └──────────────────────┘  │
│                                 │                                       │
│  ┌──────────────────┐           │             ┌──────────────────────┐  │
│  │ Incident         │           │             │   Audit Log Store    │  │
│  │ Simulator        │           │             │   (In-Memory)        │  │
│  │ (every 20s)      │           │             └──────────────────────┘  │
│  └──────────────────┘           │                                       │
└─────────────────────────────────┼───────────────────────────────────────┘
                                  │
              ┌───────────────────┴───────────────────┐
              │                                       │
              ▼                                       ▼
┌─────────────────────────┐             ┌─────────────────────────────┐
│    GROQ AI API          │             │    SPLUNK CLOUD PLATFORM    │
│    (External)           │             │    prd-p-90mda.splunkcloud  │
│                         │             │    .com                     │
│  Model: Llama 3.3 70B   │             │                             │
│                         │             │  ┌─────────────────────┐   │
│  ┌─────────────────┐    │             │  │  Log Ingestion      │   │
│  │ Root Cause      │    │             │  │  (HTTP Event        │   │
│  │ Analysis        │    │             │  │   Collector)        │   │
│  └─────────────────┘    │             │  └─────────────────────┘   │
│  ┌─────────────────┐    │             │  ┌─────────────────────┐   │
│  │ Incident        │    │             │  │  SPL Query Engine   │   │
│  │ Summarization   │    │             │  │  (REST API port     │   │
│  └─────────────────┘    │             │  │   8089)             │   │
│  ┌─────────────────┐    │             │  └─────────────────────┘   │
│  │ Conversational  │    │             │  ┌─────────────────────┐   │
│  │ AI Chat         │    │             │  │  Metrics &          │   │
│  └─────────────────┘    │             │  │  Observability Data │   │
│  ┌─────────────────┐    │             │  └─────────────────────┘   │
│  │ Action          │    │             └─────────────────────────────┘
│  │ Recommendations │    │
│  └─────────────────┘    │
└─────────────────────────┘
```

---

## Data Flow

```
1. DATA COLLECTION
   Splunk Cloud ──► collects logs, metrics, traces, security events
   Incident Simulator ──► generates realistic incidents every 20s (demo)

2. INCIDENT DETECTION
   Splunk SPL Query ──► Backend API ──► Incident List

3. AI INVESTIGATION
   User selects incident
        │
        ▼
   Backend fetches logs from Splunk (or mock data)
        │
        ▼
   Groq API (Llama 3.3 70B) analyzes:
   - Log patterns
   - Event correlation
   - Historical context
        │
        ▼
   Returns: summary, root cause, confidence, timeline, recommendations

4. HUMAN-IN-THE-LOOP APPROVAL
   AI recommendations displayed to engineer
        │
        ▼
   Engineer approves or rejects each action
        │
        ▼
   Decision logged in audit trail with timestamp

5. REAL-TIME UPDATES
   Frontend polls backend every 30 seconds
   New incidents trigger toast notifications + sound alerts
   Browser notifications for critical severity
```

---

## Component Interaction with Splunk

```
┌─────────────────────────────────────────────────────────┐
│                    SPLUNK INTEGRATION                   │
│                                                         │
│  Backend (splunk_client.py)                             │
│  ├── Connects via REST API (port 8089)                  │
│  ├── Authenticates with username/password               │
│  ├── Executes SPL search queries                        │
│  ├── Polls for job completion                           │
│  └── Returns structured event data                     │
│                                                         │
│  SPL Queries Used:                                      │
│  ├── index=* (error OR ERROR OR critical) | head 50     │
│  ├── index=* host="{host}" | head 50                    │
│  └── index=_internal | head 20 (connectivity test)     │
│                                                         │
│  Note: Demo uses simulated data due to Splunk Cloud     │
│  free trial REST API restrictions. Production           │
│  deployment connects directly to Splunk Enterprise.     │
└─────────────────────────────────────────────────────────┘
```

---

## AI Agent Integration

```
┌─────────────────────────────────────────────────────────┐
│                    AI AGENT WORKFLOW                    │
│                                                         │
│  Input: Incident description + Splunk logs              │
│       │                                                 │
│       ▼                                                 │
│  Groq API (llama-3.3-70b-versatile)                     │
│       │                                                 │
│       ├── analyze_incident()                            │
│       │   Returns JSON: {                               │
│       │     summary, root_cause, confidence,            │
│       │     severity, affected_services,                │
│       │     business_impact, timeline,                  │
│       │     recommendations: [{action, priority}]       │
│       │   }                                             │
│       │                                                 │
│       └── chat_with_ai()                                │
│           Returns: conversational plain-text response   │
│                                                         │
│  Human-in-the-Loop:                                     │
│  Engineer reviews recommendations                       │
│  ├── Approve → logged in audit trail                    │
│  └── Reject  → logged in audit trail                    │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack Summary

| Component | Technology |
|-----------|-----------|
| Frontend | React.js 18, Tailwind CSS, Recharts, Vite |
| Backend | Python 3.x, FastAPI, Uvicorn |
| AI Model | Llama 3.3 70B via Groq API |
| Splunk | Splunk Cloud, REST API, SPL |
| Voice | Web Speech API, Web Audio API |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |
| Version Control | GitHub |

---

## Hackathon Tracks

- **Observability**: Incident detection, anomaly monitoring, root cause analysis, operational response
- **Security**: Threat detection, brute force identification, security investigation, alert prioritization
- **Platform**: AI-enhanced workflows, Splunk data interaction, developer productivity
