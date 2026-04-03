import json
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class NLPService:
    def __init__(self):
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", "mock-key-if-missing"))
        
    def speech_to_text(self, audio_blob_path):
        """Use OpenAI Whisper API for speech-to-text."""
        if self.client.api_key == "mock-key-if-missing" or not self.client.api_key:
            return "This is a mocked transcription because no API key is set."
        
        try:
            with open(audio_blob_path, "rb") as audio_file:
                transcription = self.client.audio.transcriptions.create(
                    model="whisper-1", 
                    file=audio_file,
                    language="en"
                )
            return transcription.text
        except Exception as e:
            print(f"OpenAI Whisper Error: {e}")
            return "Audio transcription failed."

    def process_text(self, text):
        """Full processing pipeline using OpenAI"""
        if self.client.api_key == "mock-key-if-missing" or not self.client.api_key:
            # Fallback for when API key is not configured
            return {
                "intent": "informational",
                "entities": [{"type": "Keyword", "value": "test"}],
                "emotion": "neutral",
                "summary_eligible": True
            }

        prompt = f"""
        Analyze the following text and extract the intent, entities, and emotion.
        Respond ONLY with a valid JSON snippet following this format:
        {{
            "intent": "<task|query|emotional|informational>",
            "entities": [{{"type": "<type>", "value": "<value>"}}],
            "emotion": "<happy|neutral|sad|anxious|excited|tired|angry|etc>"
        }}

        Text to analyze: "{text}"
        """

        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
            )
            content = response.choices[0].message.content.strip()
            
            # Simple cleanup if the model included markdown blocks
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
                
            analysis = json.loads(content)
            analysis["summary_eligible"] = len(text.split()) > 5
            return analysis
        except Exception as e:
            print(f"OpenAI NLP Error: {e}")
            return {
                "intent": "informational",
                "entities": [],
                "emotion": "neutral",
                "summary_eligible": len(text.split()) > 5
            }

    def text_to_speech(self, text):
        """Mock Text-to-Speech"""
        return {"audio_url": f"https://mock-tts.api/v1/generate?text={text[:20]}..."}
