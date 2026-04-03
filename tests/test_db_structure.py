from auth import AuthSystem, DataIsolationManager
import os
import shutil
import json
from pathlib import Path

def test_structured_db():
    print("Running Structured Database & Isolation Tests...")
    auth = AuthSystem()
    
    # Cleanup previous tests
    if os.path.exists("database"):
        shutil.rmtree("database")
    
    auth._ensure_files_exist()

    # 1. Test Registration with Structured DB
    print("\nTesting Structured DB Creation...")
    success, msg = auth.register("Alice", "alice@test.com", "password123")
    print(msg)
    
    user_id = "u001"
    user_folder = Path(f"database/user_data/{user_id}")
    
    expected_files = ["raw_memory.json", "summary_memory.json", "profile.json"]
    for f in expected_files:
        file_path = user_folder / f
        if file_path.exists():
            print(f"✓ Created {f}")
        else:
            print(f"✗ Missing {f}")
            return False

    # 2. Test Strict Isolation Rules
    print("\nTesting Strict Isolation Rules...")
    
    # Valid access
    try:
        DataIsolationManager.ensure_isolation(user_id, user_folder / "raw_memory.json")
        print("✓ Allowed valid access to own folder.")
    except PermissionError:
        print("✗ Blocked valid access to own folder.")
        return False

    # Invalid access (cross-user)
    try:
        DataIsolationManager.ensure_isolation(user_id, "database/user_data/u002/raw_memory.json")
        print("✗ Failed to block cross-user access!")
        return False
    except PermissionError as e:
        print(f"✓ Correctly blocked invalid access: {e}")

    # Invalid access (system files)
    try:
        DataIsolationManager.ensure_isolation(user_id, "database/users.json")
        print("✗ Failed to block access to system files!")
        return False
    except PermissionError as e:
        print(f"✓ Correctly blocked system file access: {e}")

    print("\nALL STRUCTURED DB TESTS PASSED.")
    return True

if __name__ == "__main__":
    test_structured_db()
