# Sentinel AI — Demo Script

## Before the Demo
1. Open https://sentinel-ai-pi-three.vercel.app in Chrome (incognito for fresh experience)
2. Wake up the backend: visit https://sentinel-ai-backend-dzqz.onrender.com/health
3. Wait for the backend to respond (may take 30s if sleeping)
4. Allow microphone and notification permissions when prompted

---

## Demo Flow

### Opening (say this)
> "Sentinel AI is an autonomous incident investigation assistant. Instead of engineers manually reading thousands of logs, the AI investigates incidents, finds root causes, and recommends actions — while keeping humans in control."

### Step 1 — Landing Page
- Show the hero section and feature cards
- Click "Launch Dashboard"

### Step 2 — Login
- Use the "Admin" quick login button
- Watch the animated splash screen

### Step 3 — Live Dashboard
> "The dashboard shows live incidents. New ones appear automatically every 20 seconds — simulating a real operational environment."
- Point to the incident counter updating
- Show the severity badges (Critical, High, Medium)

### Step 4 — AI Analysis
> "Let me show you the core feature — AI-powered incident investigation."
- Click "Production API High Latency"
- Click "Analyze with Sentinel AI"
- Wait 3-5 seconds
> "The AI analyzed the logs, identified the root cause, assessed business impact, and generated a timeline — all in seconds."
- Walk through each section

### Step 5 — Human Approval
> "This is the AgenticOps principle — AI recommends, humans decide."
- Click "Approve" on the first recommendation
- Click "Reject" on another
- Go to Audit Log tab
> "Every decision is logged with timestamp and who made it."

### Step 6 — Charts
- Click Charts tab
> "Full analytics — severity distribution, incident rate over time, and a frequency heatmap."

### Step 7 — Voice
- Click Voice button
- Say: "What caused the API latency issue?"
> "Engineers can interact with Sentinel AI hands-free."

### Step 8 — Close
> "Sentinel AI demonstrates the future of AgenticOps — transforming operational data into intelligent action, while keeping humans in control."

---

## Key Talking Points
- "AI assists, humans decide" — the core principle
- Real Groq/Llama 3.3 AI — not hardcoded responses
- Fully deployed — not just localhost
- Built in [X days] for the Splunk AgenticOps Hackathon
