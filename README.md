# Sentinel AI

**Autonomous Incident Investigation & Response Assistant for Splunk AgenticOps**

## Overview

Sentinel AI is an intelligent AgenticOps platform that transforms how organizations detect, investigate, understand, and respond to operational incidents using AI and Splunk operational data. The system acts as an AI teammate for DevOps engineers, security analysts, and platform administrators.

## Key Features

- **AI-Powered Incident Detection** - Continuous monitoring of Splunk operational data
- **Autonomous Investigation** - Automatic log analysis and event correlation
- **Root Cause Analysis** - AI-driven pattern recognition and historical comparison
- **Human-Friendly Summaries** - Technical logs converted to understandable explanations
- **Business Impact Assessment** - Real-time evaluation of operational consequences
- **AI-Recommended Actions** - Intelligent remediation suggestions with human approval
- **Voice Assistant** - Conversational interaction for incident management
- **Cross-Domain Correlation** - Unified visibility across security, infrastructure, and network

## Architecture

### Frontend
- React.js with Tailwind CSS
- Real-time dashboard and incident visualization
- Voice interaction interface

### Backend
- Python with FastAPI
- Splunk integration via Python SDK
- AI orchestration and workflow management

### AI Layer
- OpenAI API or Ollama + Llama 3
- NLP summarization and root cause reasoning
- Conversational AI responses

### Splunk Integration
- Splunk Python SDK
- SPL Queries
- Splunk MCP Server

## Project Structure

```
sentinel-ai/
├── frontend/          # React.js application
├── backend/           # FastAPI server
├── ai/                # AI models and orchestration
├── splunk/            # Splunk integration
├── docs/              # Documentation
└── tests/             # Test suites
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Splunk Enterprise or Cloud instance
- OpenAI API key or Ollama setup

### Installation

```bash
# Clone repository
git clone <repository-url>
cd sentinel-ai

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
```

### Configuration

1. Copy `.env.example` to `.env`
2. Configure Splunk credentials
3. Add OpenAI API key or Ollama endpoint
4. Set up database connection (optional)

### Running the Application

```bash
# Start backend
cd backend
uvicorn main:app --reload

# Start frontend
cd frontend
npm run dev
```

## Use Cases

### Server Outage Detection
Detects CPU spikes, analyzes deployment logs, identifies memory leaks, and recommends rollback actions.

### Security Threat Detection
Correlates failed login events, identifies brute-force attacks, and suggests IP blocking.

### Network Performance Issues
Analyzes traces and metrics, identifies bottlenecks, and recommends infrastructure adjustments.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see LICENSE file for details

## Hackathon

Built for the Splunk AgenticOps Hackathon - demonstrating the future of intelligent operational resilience.
