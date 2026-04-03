import json
import os
from pathlib import Path
from ..core.security import get_password_hash, verify_password, create_access_token

USERS_FILE = Path("database/users.json")
DB_BASE_DIR = Path("database/user_data")

class DataIsolationManager:
    @staticmethod
    def get_user_folder(user_id):
        return DB_BASE_DIR / user_id

    @staticmethod
    def ensure_isolation(user_id, target_path):
        user_folder = DataIsolationManager.get_user_folder(user_id).resolve()
        target_path = Path(target_path).resolve()
        if not str(target_path).startswith(str(user_folder)):
            raise PermissionError(f"Access Denied: User {user_id} cannot access {target_path}")
        return True

class AuthSystem:
    def __init__(self):
        self._ensure_files_exist()

    def _ensure_files_exist(self):
        DB_BASE_DIR.mkdir(parents=True, exist_ok=True)
        if not USERS_FILE.exists():
            USERS_FILE.parent.mkdir(parents=True, exist_ok=True)
            with open(USERS_FILE, 'w') as f:
                json.dump([], f)

    def _generate_user_id(self, users):
        if not users:
            return "u001"
        last_id = users[-1]['user_id']
        last_num = int(last_id[1:])
        return f"u{last_num + 1:03d}"

    def register(self, name, email, password, age=None, language="English", memory_mode="Professional"):
        with open(USERS_FILE, 'r+') as f:
            users = json.load(f)
            if any(u['email'] == email for u in users):
                return False, "Email already registered."

            user_id = self._generate_user_id(users)
            hashed_pw = get_password_hash(password)

            new_user = {
                "user_id": user_id,
                "name": name,
                "email": email,
                "password": hashed_pw,
                "age": age,
                "language": language,
                "memory_mode": memory_mode,
                "created_at": str(Path().cwd()) # placeholder for timestamp
            }

            users.append(new_user)
            f.seek(0)
            json.dump(users, f, indent=4)
            f.truncate()

            user_folder = DataIsolationManager.get_user_folder(user_id)
            user_folder.mkdir(parents=True, exist_ok=True)
            
            # Initialize structured JSON files
            for filename, content in {
                "raw_memory.json": [],
                "summary_memory.json": [],
                "profile.json": new_user,
                "tasks.json": []
            }.items():
                with open(user_folder / filename, 'w') as jf:
                    json.dump(content, jf, indent=4)
            
            return True, {"user_id": user_id, "name": name}

    def _load_users(self):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)

    def login(self, email, password):
        users = self._load_users()
        user = next((u for u in users if u['email'] == email), None)
        
        if user and verify_password(password, user['password']):
            token = create_access_token(user['user_id'])
            return True, {
                "access_token": token,
                "token_type": "bearer",
                "user": {
                    "user_id": user['user_id'],
                    "name": user['name'],
                    "email": user['email'],
                    "memory_mode": user.get('memory_mode', 'Professional')
                }
            }
        return False, "Invalid email or password"

    def forgot_password(self, email):
        users = self._load_users()
        if any(u['email'] == email for u in users):
            # In a real app, send a reset token via email
            return True, "Password reset link sent to your email"
        return False, "Email not found"
