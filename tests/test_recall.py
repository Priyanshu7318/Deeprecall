from auth import AuthSystem
from memory_manager import RawMemoryManager
from summarizer import MemorySummarizer
from recall_engine import RecallEngine
import os
import shutil
from datetime import datetime, timedelta

def test_recall():
    print("Running Memory Recall Engine Tests...")
    
    # Setup
    if os.path.exists("database"):
        shutil.rmtree("database")
    
    auth = AuthSystem()
    auth.register("RecallUser", "recall@test.com", "pass")
    user_id = "u001"
    
    mem_mgr = RawMemoryManager(user_id)
    summarizer = MemorySummarizer(user_id)
    recall_engine = RecallEngine(user_id)
    
    # 1. Inject memories with specific keywords
    print("\nInjecting test data...")
    yesterday = (datetime.now() - timedelta(days=1)).isoformat()
    
    # Raw memory from yesterday
    mem_mgr.add_memory("I have a Math exam on Friday.", "educational", ["Math", "exam"], "neutral")
    # Manually update timestamp to yesterday for testing
    mems = mem_mgr.get_all_memories()
    mems[0]['timestamp'] = yesterday
    import json
    with open(mem_mgr.raw_memory_file, 'w') as f:
        json.dump(mems, f)

    # 2. Test keyword recall
    print("Testing keyword recall ('exam')...")
    res1 = recall_engine.query("When is my exam?")
    if res1 and "Math exam" in res1['content']:
        print(f"✓ Found correct memory. Confidence: {res1['score']:.2f}")
    else:
        print(f"✗ Failed to find memory by keyword: {res1}")
        return False

    # 3. Test temporal recall
    print("Testing temporal recall ('yesterday')...")
    res2 = recall_engine.query("What did I do yesterday?")
    if res2 and res2['score'] >= 0.5: # Should get boost from 'yesterday'
        print(f"✓ Found yesterday's memory. Confidence: {res2['score']:.2f}")
    else:
        print(f"✗ Failed temporal recall: {res2}")
        return False

    print("\nALL RECALL ENGINE TESTS PASSED.")
    return True

if __name__ == "__main__":
    test_recall()
