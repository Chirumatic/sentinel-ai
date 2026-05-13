from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional
import os

load_dotenv()

app = FastAPI(
    title="Sentinel AI API",
    description="Autonomous Incident Investigation & Response Assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Request Models ---

class IncidentAnalysisRequest(BaseModel):
    incident_id: str

class ChatRequest(BaseModel):
    message: str
    incident_context: Optional[dict] = None

# --- Health ---

@app.get("/")
async def root():
    return {"message": "Sentinel AI API", "status": "operational", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# --- Incident Routes ---

@app.get("/api/incidents")
async def get_incidents():
    from mock_data import get_all_incidents
    return {"incidents": get_all_incidents()}

@app.get("/api/incidents/{incident_id}")
async def get_incident(incident_id: str):
    from mock_data import get_incident_by_id, get_logs_for_incident
    incident = get_incident_by_id(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    logs = get_logs_for_incident(incident_id)
    return {"incident": incident, "logs": logs}

# --- AI Routes ---

@app.post("/api/ai/analyze")
async def analyze_incident(request: IncidentAnalysisRequest):
    from mock_data import get_incident_by_id, get_logs_for_incident
    from ai_client import analyze_incident as ai_analyze

    incident = get_incident_by_id(request.incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    logs = get_logs_for_incident(request.incident_id)

    try:
        analysis = ai_analyze(logs, incident["description"])
        return {"incident_id": request.incident_id, "analysis": analysis, "logs_analyzed": len(logs)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

@app.post("/api/ai/chat")
async def chat(request: ChatRequest):
    from ai_client import chat_with_ai
    try:
        response = chat_with_ai(request.message, request.incident_context)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI chat failed: {str(e)}")

@app.get("/api/logs/errors")
async def get_errors():
    from mock_data import get_recent_errors
    errors = get_recent_errors()
    return {"errors": errors, "count": len(errors)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("BACKEND_PORT", 8000)))
