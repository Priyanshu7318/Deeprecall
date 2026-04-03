import json
import uuid
import os
from datetime import datetime
from pathlib import Path
from openai import OpenAI
import chromadb
from chromadb.utils import embedding_functions
from dotenv import load_dotenv

from .auth_service import DataIsolationManager
from .nlp_service import NLPService

load_dotenv()
nlp = NLPService()

class RawMemoryManager:
    def __init__(self, user_id):
        self.user_id = user_id
        self.user_folder = DataIsolationManager.get_user_folder(user_id)
        self.raw_memory_file = self.user_folder / "raw_memory.json"
        
        # Initialize Vector Database for this user
        self.chroma_dir = self.user_folder / "chroma_db"
        self.chroma_client = chromadb.PersistentClient(path=str(self.chroma_dir))
        
        api_key = os.environ.get("OPENAI_API_KEY", "mock-key-if-missing")
        if api_key != "mock-key-if-missing":
            openai_ef = embedding_functions.OpenAIEmbeddingFunction(
                api_key=api_key,
                model_name="text-embedding-ada-002"
            )
            self.collection = self.chroma_client.get_or_create_collection(
                name="memories", 
                embedding_function=openai_ef
            )
        else:
            # Fallback to default embedding function if no API key
            self.collection = self.chroma_client.get_or_create_collection(name="memories")
        
    def add_memory(self, text, category="Conversation", intent=None, entities=None, emotion=None):
        DataIsolationManager.ensure_isolation(self.user_id, self.raw_memory_file)
        
        # Auto-process with NLP if fields are missing
        if intent is None or emotion is None:
            analysis = nlp.process_text(text)
            intent = intent or analysis.get("intent", "informational")
            emotion = emotion or analysis.get("emotion", "neutral")
            entities = entities or analysis.get("entities", [])

        if entities is None:
            entities = []
            
        memory_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()
        
        memory_entry = {
            "memory_id": memory_id,
            "user_id": self.user_id,
            "timestamp": timestamp,
            "text": text,
            "category": category,
            "intent": intent,
            "entities": entities,
            "emotion": emotion
        }
        
        memories = []
        if self.raw_memory_file.exists():
            with open(self.raw_memory_file, 'r') as f:
                try:
                    memories = json.load(f)
                except json.JSONDecodeError:
                    memories = []
                    
        memories.append(memory_entry)
        with open(self.raw_memory_file, 'w') as f:
            json.dump(memories, f, indent=4)
            
        # Add to ChromaDB
        try:
            self.collection.add(
                documents=[text],
                metadatas=[{
                    "category": category,
                    "intent": intent,
                    "emotion": emotion,
                    "timestamp": timestamp,
                    "type": "raw"
                }],
                ids=[memory_id]
            )
        except Exception as e:
            print(f"ChromaDB Add Error: {e}")
            
        return memory_id

    def get_all_memories(self):
        DataIsolationManager.ensure_isolation(self.user_id, self.raw_memory_file)
        if not self.raw_memory_file.exists():
            return []
        with open(self.raw_memory_file, 'r') as f:
            return json.load(f)
