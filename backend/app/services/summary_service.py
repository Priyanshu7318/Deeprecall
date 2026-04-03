import json
import os
from datetime import datetime, timedelta
from pathlib import Path
from collections import Counter
from openai import OpenAI
from dotenv import load_dotenv
from .auth_service import DataIsolationManager

load_dotenv()

class MemorySummarizer:
    """Processes raw memory logs into daily and weekly summaries with mood detection using OpenAI."""
    
    def __init__(self, user_id):
        self.user_id = user_id
        self.user_folder = DataIsolationManager.get_user_folder(user_id)
        self.raw_memory_file = self.user_folder / "raw_memory.json"
        self.summary_file = self.user_folder / "summary_memory.json"
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", "mock-key-if-missing"))
        
    def _load_raw_memories(self):
        """Loads raw memories for the user."""
        DataIsolationManager.ensure_isolation(self.user_id, self.raw_memory_file)
        if not self.raw_memory_file.exists():
            return []
        with open(self.raw_memory_file, 'r') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []

    def _save_summary(self, summary_entry):
        """Appends a new summary to the summary_memory.json file."""
        DataIsolationManager.ensure_isolation(self.user_id, self.summary_file)
        summaries = []
        if self.summary_file.exists():
            with open(self.summary_file, 'r') as f:
                try:
                    summaries = json.load(f)
                except json.JSONDecodeError:
                    summaries = []
        
        summaries.append(summary_entry)
        with open(self.summary_file, 'w') as f:
            json.dump(summaries, f, indent=4)

    def _generate_ai_summary(self, memories, period_label):
        """Calls OpenAI to generate a natural language summary of memories."""
        if self.client.api_key == "mock-key-if-missing" or not self.client.api_key:
            intents = list(set(m.get('intent', '') for m in memories))
            return f"Mocked AI Summary for {period_label}. Main themes: {', '.join(intents)}."
            
        # Format memories for prompt
        mem_text = "\n".join([f"- [{m.get('timestamp')}] {m.get('text')}" for m in memories])
        
        prompt = f"""
        You are DeepRecall, an AI assistant that synthesizes a user's memories.
        Review the following memories from the {period_label} and write a cohesive, 
        concise narrative summary (2-3 sentences) of what the user experienced, thought about, or accomplished.

        Memories:
        {mem_text}
        
        Summary:
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=150
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"OpenAI Summary Error: {e}")
            return "Unable to generate AI summary at this time."

    def generate_daily_summary(self, date_str=None):
        """Generates a summary for a specific day."""
        if date_str is None:
            date_str = datetime.now().strftime("%Y-%m-%d")
            
        memories = self._load_raw_memories()
        daily_mems = [m for m in memories if m.get('timestamp', '').startswith(date_str)]
        
        if not daily_mems:
            return None
            
        # Analyze mood
        emotions = [m.get('emotion') for m in daily_mems if m.get('emotion')]
        mood_pattern = Counter(emotions).most_common(1)[0][0] if emotions else "neutral"
        
        # Generate content
        content = self._generate_ai_summary(daily_mems, "day")
        
        summary = {
            "type": "daily",
            "date": date_str,
            "content": content,
            "mood_pattern": mood_pattern,
            "memory_count": len(daily_mems),
            "generated_at": datetime.now().isoformat()
        }
        
        self._save_summary(summary)
        return summary

    def generate_weekly_summary(self):
        """Generates a summary for the last 7 days."""
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)
        
        memories = self._load_raw_memories()
        weekly_mems = []
        for m in memories:
            m_date = datetime.fromisoformat(m['timestamp'].replace('Z', '+00:00'))
            # simplify tz removal for matching
            m_date = m_date.replace(tzinfo=None)
            if start_date <= m_date <= end_date:
                weekly_mems.append(m)
                
        if not weekly_mems:
            return None
            
        emotions = [m.get('emotion') for m in weekly_mems if m.get('emotion')]
        mood_pattern = Counter(emotions).most_common(1)[0][0] if emotions else "neutral"
        
        content = self._generate_ai_summary(weekly_mems, "week")
        
        summary = {
            "type": "weekly",
            "period": f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            "content": content,
            "dominant_mood": mood_pattern,
            "memory_count": len(weekly_mems),
            "generated_at": datetime.now().isoformat()
        }
        
        self._save_summary(summary)
        return summary
