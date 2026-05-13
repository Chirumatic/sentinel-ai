# Sentinel AI Architecture

## System Overview

Sentinel AI is built on a modern microservices architecture with clear separation of concerns.

## Components

### Frontend Layer
- **Technology**: React.js + Tailwind CSS
- **Responsibilities**:
  - Dashboard UI
  - Incident visualization
  - Real-time updates
  - Voice interaction interface
  - Timeline display

### Backend Layer
- **Technology**: Python + FastAPI
- **Responsibilities**:
  - API endpoints
  - Business logic
  - Authentication/Authorization
  - Workflow orchestration
  - WebSocket connections

### AI Layer
- **Technology**: OpenAI API / Ollama + Llama 3
- **Responsibilities**:
  - Incident summarization
  - Root cause analysis
  - Action recommendations
  - Conversational AI
  - Pattern recognition

### Splunk Integration Layer
- **Technology**: Splunk Python SDK
- **Responsibilities**:
  - Log retrieval
  - Metrics collection
  - Event correlation
  - Real-time monitoring
  - SPL query execution

### Data Layer (Optional)
- **Technology**: PostgreSQL / MongoDB
- **Responsibilities**:
  - Incident history
  - User actions
  - AI feedback
  - Analytics

## Data Flow

1. **Detection**: Splunk detects anomaly/alert
2. **Ingestion**: Backend receives event via webhook/polling
3. **Investigation**: AI agent queries Splunk for related data
4. **Analysis**: AI performs root cause analysis
5. **Presentation**: Results displayed in dashboard
6. **Action**: Human approves/rejects AI recommendations
7. **Execution**: Approved actions executed with audit trail

## Security

- JWT-based authentication
- Role-based access control
- Encrypted Splunk credentials
- Audit logging
- Human-in-the-loop approval

## Scalability

- Stateless backend services
- Async processing
- Message queue for long-running tasks
- Horizontal scaling capability
