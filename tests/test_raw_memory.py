from auth import AuthSystem
from memory_manager import RawMemoryManager
import os
import shutil
import json

def test_raw_memory():
    print("Running Raw Memory Storage Tests...")
    auth = AuthSystem()
    
    # Setup test user
    if os.path.exists("database"):
        shutil.rmtree("database")
    
    auth = AuthSystem() # Initialize after cleanup to recreate folders
    auth.register("Tester", "test@memory.com", "pass")
    user_id = "u001"
    
    mem_mgr = RawMemoryManager(user_id)
    
    # 1. Test adding structured memory
    print("\nTesting Memory Entry...")
    text = "I had a great meeting with Sarah about the new project today."
    intent = "report_activity"
    entities = ["Sarah", "new project"]
    emotion = "positive"
    
    mem_id = mem_mgr.add_memory(text, intent, entities, emotion)
    print(f"✓ Added memory with ID: {mem_id}")
    
    # 2. Verify JSON structure
    raw_mem_path = f"database/user_data/{user_id}/raw_memory.json"
    with open(raw_mem_path, 'r') as f:
        data = json.load(f)
        entry = data[0]
        
        required_keys = ["memory_id", "user_id", "timestamp", "text", "intent", "entities", "emotion"]
        all_keys_present = all(k in entry for k in required_keys)
        
        if all_keys_present and entry['text'] == text:
            print("✓ Memory structure is correct and data matches.")
        else:
            print("✗ Memory structure or data mismatch.")
            return False

    # 3. Test multiple entries
    mem_mgr.add_memory("Later I went for a walk.", "leisure", [], "calm")
    data = mem_mgr.get_all_memories()
    if len(data) == 2:
        print(f"✓ Successfully stored multiple memories (Total: {len(data)})")
    else:
        print(f"✗ Failed to store multiple memories.")
        return False

    print("\nALL RAW MEMORY TESTS PASSED.")
    return True

if __name__ == "__main__":
    test_raw_memory()
