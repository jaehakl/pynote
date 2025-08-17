from __future__ import annotations

def gmail_list(label: str = "IMPORTANT", limit: int = 10):
    return [
        {"from": "Ada <ada@example.com>", "subject": "Paper draft v2", "snippet": "Please review…"},
        {"from": "HR <hr@example.com>", "subject": "Policy update", "snippet": "We changed…"},
    ][:limit]

def gcal_today():
    return [
        {"time": "09:30", "title": "Standup", "location": "Zoom"},
        {"time": "13:00", "title": "Client call", "location": "Seoul"},
    ]

def drive_tree():
    return {"Google Drive": {"Reports": {"budget.xlsx": None}, "Notes": {"ideas.md": None}}}

