from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import sys
import os
from jose import jwt, JWTError


# Add parent dir to path for relative imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from .services.auth_service import AuthSystem, DataIsolationManager
from .services.memory_service import RawMemoryManager
from .services.summary_service import MemorySummarizer
from .services.recall_service import RecallEngine
from .services.task_service import TaskService
from .core.security import SECRET_KEY, ALGORITHM

app = FastAPI(title="DeepRecall AI - Production API")
security = HTTPBearer()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

auth_system = AuthSystem()
task_service = TaskService()

# --- Dependency ---
async def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# --- Models ---
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    age: Optional[int] = None
    language: Optional[str] = "English"
    memory_mode: Optional[str] = "Professional"

class UserLogin(BaseModel):
    email: str
    password: str

class ForgotPassword(BaseModel):
    email: str

class MemoryCreate(BaseModel):
    text: str
    category: Optional[str] = "Conversation" # Tasks, Events, Health, Emotions, Conversations
    intent: Optional[str] = "informational"
    entities: Optional[List[str]] = []
    emotion: Optional[str] = "neutral"

class QueryRequest(BaseModel):
    query: str

class TaskCreate(BaseModel):
    title: str
    category: Optional[str] = "General"
    priority: Optional[str] = "Medium"

class TaskUpdate(BaseModel):
    status: str

# --- Endpoints ---

@app.post("/api/auth/register")
async def register(user: UserRegister):
    success, result = auth_system.register(
        user.name, user.email, user.password, user.age, user.language, user.memory_mode
    )
    if not success:
        raise HTTPException(status_code=400, detail=result)
    return result

@app.post("/api/auth/login")
async def login(user: UserLogin):
    success, result = auth_system.login(user.email, user.password)
    if not success:
        raise HTTPException(status_code=401, detail=result)
    return result

@app.post("/api/auth/forgot-password")
async def forgot_password(req: ForgotPassword):
    success, result = auth_system.forgot_password(req.email)
    if not success:
        raise HTTPException(status_code=404, detail=result)
    return {"message": result}

@app.get("/api/memories")
async def get_memories(user_id: str = Depends(get_current_user)):
    mgr = RawMemoryManager(user_id)
    return mgr.get_all_memories()

@app.post("/api/memories")
async def add_memory(mem: MemoryCreate, user_id: str = Depends(get_current_user)):
    mgr = RawMemoryManager(user_id)
    memory_id = mgr.add_memory(
        text=mem.text, 
        category=mem.category,
        intent=mem.intent,
        entities=mem.entities,
        emotion=mem.emotion
    )
    return {"memory_id": memory_id, "status": "stored"}

@app.post("/api/memories/audio")
async def add_memory_audio(
    audio: UploadFile = File(...), 
    user_id: str = Depends(get_current_user)
):
    import shutil
    import tempfile
    import os
    from .services.nlp_service import NLPService
    
    # Save the custom audio file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        shutil.copyfileobj(audio.file, tmp)
        tmp_path = tmp.name
        
    try:
        nlp = NLPService()
        transcribed_text = nlp.speech_to_text(tmp_path)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
            
    if "failed" in transcribed_text.lower():
        raise HTTPException(status_code=500, detail="Transcription failed")
        
    mgr = RawMemoryManager(user_id)
    memory_id = mgr.add_memory(
        text=transcribed_text,
        category="Voice Note"
    )
    return {"memory_id": memory_id, "text": transcribed_text, "status": "stored"}

@app.get("/api/summaries")
async def get_summaries(user_id: str = Depends(get_current_user)):
    summarizer = MemorySummarizer(user_id)
    summary_file = summarizer.summary_file
    if not summary_file.exists():
        return []
    import json
    with open(summary_file, 'r') as f:
        return json.load(f)

@app.post("/api/summaries/generate")
async def generate_summary(user_id: str = Depends(get_current_user)):
    summarizer = MemorySummarizer(user_id)
    summarizer.generate_daily_summary()
    return {"message": "Summary generated successfully"}

@app.get("/api/recall")
async def recall(query: str, user_id: str = Depends(get_current_user)):
    engine = RecallEngine(user_id)
    result = engine.query(query)
    if not result:
        return {"message": "No memory found", "score": 0}
    return result

# --- Task Endpoints ---

@app.get("/api/tasks")
async def get_tasks(user_id: str = Depends(get_current_user)):
    return task_service.get_tasks(user_id)

@app.post("/api/tasks")
async def create_task(task: TaskCreate, user_id: str = Depends(get_current_user)):
    return task_service.create_task(user_id, task.title, task.category, task.priority)

@app.patch("/api/tasks/{task_id}")
async def update_task(task_id: str, task: TaskUpdate, user_id: str = Depends(get_current_user)):
    task_service.update_task_status(user_id, task_id, task.status)
    return {"message": "Task updated"}

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: str, user_id: str = Depends(get_current_user)):
    task_service.delete_task(user_id, task_id)
    return {"message": "Task deleted"}

# --- Profile Endpoint ---

@app.get("/api/profile")
async def get_profile(user_id: str = Depends(get_current_user)):
    user_folder = DataIsolationManager.get_user_folder(user_id)
    profile_path = user_folder / "profile.json"
    import json
    if profile_path.exists():
        with open(profile_path, 'r') as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Profile not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
