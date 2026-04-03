from auth import AuthSystem
from memory_manager import RawMemoryManager
from summarizer import MemorySummarizer
import os
import shutil
import json
from datetime import datetime

def test_summarization():
    print("Running AI Summarization & Diary Tests...")
    
    # Setup fresh test environment
    if os.path.exists("database"):
        shutil.rmtree("database")
    
    auth = AuthSystem()
    auth.register("DiaryUser", "diary@test.com", "password")
    user_id = "u001"
    
    mem_mgr = RawMemoryManager(user_id)
    summarizer = MemorySummarizer(user_id)
    
    # 1. Inject some fake memories for today
    print("\nInjecting test memories...")
    today = datetime.now().strftime("%Y-%m-%d")
    
    mem_mgr.add_memory("Woke up early and felt energetic.", "routine", ["morning"], "positive")
    mem_mgr.add_memory("Had a tough meeting at work.", "work", ["meeting", "boss"], "stressed")
    mem_mgr.add_memory("Met Sarah for coffee in the evening.", "social", ["Sarah", "coffee"], "positive")
    
    # 2. Test Daily Summary
    print("Generating Daily Summary...")
    daily = summarizer.generate_daily_summary(today)
    
    if daily and daily['mood_pattern'] == "positive": # Most common emotion is positive (2 out of 3)
        print(f"✓ Daily summary generated. Mood: {daily['mood_pattern']}")
    else:
        print(f"✗ Daily summary failed or mood detection incorrect: {daily}")
        return False

    # 3. Test Weekly Summary
    print("Generating Weekly Summary...")
    weekly = summarizer.generate_weekly_summary()
    if weekly and weekly['memory_count'] == 3:
        print(f"✓ Weekly summary generated. Interaction count: {weekly['memory_count']}")
    else:
        print(f"✗ Weekly summary failed: {weekly}")
        return False

    # 4. Verify storage in summary_memory.json
    summary_path = f"database/user_data/{user_id}/summary_memory.json"
    with open(summary_path, 'r') as f:
        data = json.load(f)
        if len(data) == 2: # One daily, one weekly
            print("✓ Both summaries stored correctly in summary_memory.json")
        else:
            print(f"✗ Summary storage mismatch. Expected 2, found {len(data)}")
            return False

    print("\nALL SUMMARIZATION TESTS PASSED.")
    return True

if __name__ == "__main__":
    test_summarization()
