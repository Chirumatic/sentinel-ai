# Sentinel AI — Hackathon Submission

## Project Title
**Sentinel AI: Autonomous Incident Investigation & Response Assistant**

## Live Demo
- **App**: https://sentinel-ai-pi-three.vercel.app
- **API**: https://sentinel-ai-backend-dzqz.onrender.com
- **GitHub**: https://github.com/Chirumatic/sentinel-ai

---

## One-Line Description
Sentinel AI is an AgenticOps platform that autonomously detects, investigates, and recommends responses to operational incidents using AI — while keeping humans in control of every decision.

---

## Problem Statement
Modern organizations generate massive amounts of operational data — logs, metrics, traces, security events, and infrastructure telemetry. Teams struggle with:
- Alert fatigue from thousands of daily notifications
- Slow manual investigation of incidents
- Disconnected visibility across security, infrastructure, and application layers
- Delayed response times that increase business impact

**Sentinel AI solves this by turning raw operational data into actionable intelligence.**

---

## Solution

Sentinel AI acts as an AI teammate for DevOps engineers, security analysts, and platform teams. It:

1. **Detects** incidents automatically from operational data
2. **Investigates** by analyzing logs, correlating events, and reconstructing timelines
3. **Explains** findings in plain English — not raw log dumps
4. **Recommends** remediation actions ranked by priority
5. **Keeps humans in control** — every AI recommendation requires human approval

---

## Key Features

| Feature | Description |
|---------|-------------|
| AI-Powered Analysis | Root cause analysis using Llama 3.3 via Groq |
| Real-Time Incidents | Auto-generated incidents every 20 seconds |
| Human-in-the-Loop | Approve/reject AI recommendations with audit trail |
| Voice Assistant | Speak to Sentinel AI, hear responses out loud |
| AI Chat | Conversational incident investigation |
| Analytics Dashboard | Charts, heatmap, incident rate graph |
| Export Reports | Download TXT/JSON incident reports |
| Live Activity Feed | Real-time event stream |
| Mobile Responsive | Full mobile layout with bottom navigation |
| Demo Walkthrough | 8-step guided tour for judges |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, Recharts, Vite |
| Backend | Python, FastAPI |
| AI | Groq API, Llama 3.3 70B |
| Data | Splunk (architecture), Mock data for demo |
| Voice | Web Speech API, Web Audio API |
| Deployment | Vercel (frontend), Render (backend) |

---

## AgenticOps Alignment

Sentinel AI directly demonstrates the AgenticOps vision:

- **Autonomous Investigation**: AI agents investigate incidents without human prompting
- **Human-in-the-Loop**: Engineers approve every AI recommendation — AI assists, humans decide
- **Operational Intelligence**: Converts machine data into actionable insights
- **Cross-Domain Correlation**: Connects security, infrastructure, database, and network events

---

## Demo Script (5 minutes)

### 1. Landing Page (30s)
- Open https://sentinel-ai-pi-three.vercel.app
- Show the landing page — features, use cases, tech stack

### 2. Login (30s)
- Click "Launch Dashboard"
- Use quick login: Admin account
- Show the animated splash screen

### 3. Live Incidents (1 min)
- Show incidents auto-appearing every 20 seconds
- Point out severity badges, status indicators, live counter
- Show the search and filter functionality

### 4. AI Analysis (1.5 min)
- Click "Production API High Latency"
- Click "Analyze with Sentinel AI"
- Walk through: Summary → Root Cause → Confidence → Timeline → Recommendations
- Show Approve/Reject buttons on recommendations
- Open Audit Log tab to show the decision was recorded

### 5. Charts & Analytics (30s)
- Click Charts tab
- Show: Severity pie, Status bar, Incident rate graph, Heatmap

### 6. Voice Assistant (30s)
- Click Voice button
- Ask: "What caused the API latency issue?"
- Show AI responding in text and speaking out loud

### 7. AI Chat (30s)
- Open AI Chat panel
- Ask: "How do I prevent this from happening again?"
- Show bullet-point response

---

## Hackathon Track Alignment

- **Observability Track**: Intelligent monitoring, incident summarization, root-cause analysis
- **Security Track**: Threat detection, security investigation, alert prioritization
- **Platform Track**: AI-enhanced workflows, developer productivity, operational automation

---

## What Makes This Stand Out

1. **End-to-end AgenticOps demo** — not just a dashboard, but a full AI investigation workflow
2. **Human-in-the-loop by design** — every AI action requires human approval
3. **Voice interaction** — memorable, differentiating demo feature
4. **Live incidents** — auto-generating every 20 seconds for a dynamic demo
5. **Production deployed** — fully live on Vercel + Render, not just localhost
6. **Mobile responsive** — works on any device

---

## Submission Checklist

- [x] Project deployed and publicly accessible
- [x] GitHub repository public
- [x] README with setup instructions
- [x] Live demo URL working
- [x] API documentation at /docs
- [x] All core features working
- [x] Mobile responsive
- [x] Demo walkthrough mode built-in
