import json
import os
from pathlib import Path
from openai import OpenAI
import chromadb
from chromadb.utils import embedding_functions
from dotenv import load_dotenv

from .auth_service import DataIsolationManager

load_dotenv()

class RecallEngine:
    """Engine for searching and retrieving memories based on semantic meaning using ChromaDB."""
    
    def __init__(self, user_id):
        self.user_id = user_id
        self.user_folder = DataIsolationManager.get_user_folder(user_id)
        
        # Connect to existing ChromaDB
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
            self.collection = self.chroma_client.get_or_create_collection(name="memories")

    def query(self, user_query):
        """Searches ChromaDB for the most semantically relevant memory."""
        try:
            results = self.collection.query(
                query_texts=[user_query],
                n_results=1
            )
            
            if not results['documents'] or not results['documents'][0]:
                return None
                
            # ChromaDB returns a list of lists for documents, metadatas, and distances
            best_match_text = results['documents'][0][0]
            best_match_meta = results['metadatas'][0][0]
            # Convert L2 distance to a mock confidence score (0 to 1)
            # Closer to 0 distance means higher confidence
            distance = results['distances'][0][0]
            confidence = max(0.0, 1.0 - (distance / 2.0))
            
            return {
                "score": confidence,
                "type": best_match_meta.get('type', 'raw'),
                "content": best_match_text,
                "timestamp": best_match_meta.get('timestamp'),
                "metadata": {
                    "intent": best_match_meta.get('intent'),
                    "emotion": best_match_meta.get('emotion'),
                    "category": best_match_meta.get('category')
                }
            }
        except Exception as e:
            print(f"Recall Engine Error: {e}")
            return None
