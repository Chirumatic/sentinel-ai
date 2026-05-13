# Sentinel AI API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
All endpoints (except `/health`) require JWT authentication.

```
Authorization: Bearer <token>
```

## Endpoints

### Health Check
```
GET /health
```

### Incidents

#### List Incidents
```
GET /api/incidents
Query Parameters:
  - status: active|resolved|investigating
  - severity: critical|high|medium|low
  - limit: number (default: 50)
```

#### Get Incident Details
```
GET /api/incidents/{incident_id}
```

#### Create Incident
```
POST /api/incidents
Body: {
  "title": "string",
  "description": "string",
  "severity": "critical|high|medium|low",
  "source": "string"
}
```

### AI Analysis

#### Analyze Incident
```
POST /api/ai/analyze/{incident_id}
Response: {
  "summary": "string",
  "root_cause": "string",
  "confidence": 0.0-1.0,
  "recommendations": []
}
```

#### Get Recommendations
```
GET /api/ai/recommendations/{incident_id}
```

### Splunk Integration

#### Query Logs
```
POST /api/splunk/query
Body: {
  "query": "SPL query string",
  "earliest_time": "ISO timestamp",
  "latest_time": "ISO timestamp"
}
```

#### Get Metrics
```
GET /api/splunk/metrics/{metric_name}
```

### Actions

#### List Available Actions
```
GET /api/actions
```

#### Execute Action
```
POST /api/actions/execute
Body: {
  "incident_id": "string",
  "action_id": "string",
  "approved_by": "string"
}
```

## WebSocket

### Real-time Incident Updates
```
WS /ws/incidents
```

### Voice Assistant
```
WS /ws/voice
```

## Error Responses

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Rate Limiting
- 100 requests per minute per user
- 1000 requests per hour per user
