from auth import AuthSystem
import os
import shutil
import json

def test_auth():
    print("Running Authentication & Isolation Tests...")
    auth = AuthSystem()
    
    # Cleanup previous tests if any
    if os.path.exists("users.json"):
        os.remove("users.json")
    if os.path.exists("memories"):
        shutil.rmtree("memories")
    
    auth._ensure_files_exist()

    # 1. Test Registration
    print("\nTesting Registration...")
    s1, m1 = auth.register("Alice", "alice@test.com", "password123")
    s2, m2 = auth.register("Bob", "bob@test.com", "secure456")
    
    print(f"Alice: {m1}")
    print(f"Bob: {m2}")
    
    # Verify IDs
    with open("users.json", 'r') as f:
        users = json.load(f)
        print(f"Registered IDs: {[u['user_id'] for u in users]}")

    # 2. Test Login
    print("\nTesting Login...")
    l1_s, l1_r = auth.login("alice@test.com", "password123")
    l2_s, l2_r = auth.login("bob@test.com", "wrongpassword")
    
    print(f"Alice Login Success: {l1_s}")
    print(f"Bob Login (Wrong PW) Success: {l2_s}")

    # 3. Test Isolation
    print("\nTesting Isolation...")
    alice_path = auth.get_user_memory_path("u001")
    bob_path = auth.get_user_memory_path("u002")
    
    print(f"Alice Memory Path: {alice_path}")
    print(f"Bob Memory Path: {bob_path}")
    
    if alice_path != bob_path and str(alice_path).endswith("u001") and str(bob_path).endswith("u002"):
        print("SUCCESS: User memory folders are isolated and correctly named.")
    else:
        print("FAILURE: Isolation test failed.")

if __name__ == "__main__":
    test_auth()
