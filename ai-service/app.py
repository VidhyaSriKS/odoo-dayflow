from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
from services.ai_engine import DayflowAIEngine

app = FastAPI(
    title="Dayflow AI Service",
    description="AI Engine providing Natural Language HR Data Queries and Attendance Pattern Insights",
    version="1.0.0"
)

# Enable CORS for frontend and backend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = DayflowAIEngine()

class ChatQueryRequest(BaseModel):
    prompt: str
    user_role: Optional[str] = "EMPLOYEE"
    user_id: Optional[int] = None

class ChatQueryResponse(BaseModel):
    response: str
    data_source: str
    suggested_actions: List[str]

@app.get("/")
def read_root():
    return {
        "service": "Dayflow AI Service",
        "status": "ONLINE",
        "version": "1.0.0"
    }

@app.post("/api/ai/chat", response_model=ChatQueryResponse)
def handle_chat_query(request: ChatQueryRequest):
    if not request.prompt or len(request.prompt.strip()) == 0:
        raise HTTPException(status_code=400, detail="Prompt must not be empty.")
    
    result = engine.process_chat_query(
        prompt=request.prompt,
        user_role=request.user_role,
        user_id=request.user_id
    )
    return result

@app.get("/api/ai/insights")
def get_attendance_insights():
    return {
        "status": "SUCCESS",
        "insights": engine.generate_attendance_insights()
    }

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
