import json
from pathlib import Path
from datetime import datetime
from .auth_service import DB_BASE_DIR

class TaskService:
    def _get_user_tasks_file(self, user_id: str) -> Path:
        return DB_BASE_DIR / user_id / "tasks.json"

    def get_tasks(self, user_id: str):
        tasks_file = self._get_user_tasks_file(user_id)
        if not tasks_file.exists():
            return []
        with open(tasks_file, 'r') as f:
            return json.load(f)

    def create_task(self, user_id: str, title: str, category: str = "General", priority: str = "Medium"):
        tasks_file = self._get_user_tasks_file(user_id)
        tasks = self.get_tasks(user_id)
        
        new_task = {
            "task_id": f"t{len(tasks) + 1:03d}",
            "title": title,
            "category": category,
            "priority": priority,
            "status": "Pending",
            "created_at": datetime.now().isoformat(),
            "completed_at": None
        }
        
        tasks.append(new_task)
        with open(tasks_file, 'w') as f:
            json.dump(tasks, f, indent=4)
        return new_task

    def update_task_status(self, user_id: str, task_id: str, status: str):
        tasks_file = self._get_user_tasks_file(user_id)
        tasks = self.get_tasks(user_id)
        
        for task in tasks:
            if task['task_id'] == task_id:
                task['status'] = status
                if status == "Completed":
                    task['completed_at'] = datetime.now().isoformat()
                break
        
        with open(tasks_file, 'w') as f:
            json.dump(tasks, f, indent=4)
        return True

    def delete_task(self, user_id: str, task_id: str):
        tasks_file = self._get_user_tasks_file(user_id)
        tasks = self.get_tasks(user_id)
        
        tasks = [t for t in tasks if t['task_id'] != task_id]
        
        with open(tasks_file, 'w') as f:
            json.dump(tasks, f, indent=4)
        return True
