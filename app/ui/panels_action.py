from __future__ import annotations
from PySide6.QtWidgets import QGroupBox, QVBoxLayout, QListWidget, QListWidgetItem
from PySide6.QtCore import Qt
from ..providers import MockProvider

class Panel(QGroupBox):
    def __init__(self, title: str):
        super().__init__(title)
        self.setAlignment(Qt.AlignmentFlag.AlignLeft)
        self.vbox = QVBoxLayout(self)

class GmailPanel(Panel):
    def __init__(self, google=None):
        super().__init__("Gmail — Inbox (label: IMPORTANT)")
        self.google = google
        self.list = QListWidget(); self.vbox.addWidget(self.list)
        self.refresh()
    def refresh(self):
        self.list.clear()
        items = (self.google.gmail_list(["UNREAD", "IMPORTANT"]) if self.google else MockProvider.gmail_list())
        for m in items:
            self.list.addItem(QListWidgetItem(f"{m['subject']} — {m['from']}\n{m['snippet']}"))

class TodayCalendarPanel(Panel):
    def __init__(self, google=None):
        super().__init__("오늘의 일정 (Google Calendar)")
        self.google = google
        self.list = QListWidget(); self.vbox.addWidget(self.list)
        self.refresh()
    def refresh(self):
        self.list.clear()
        items = (self.google.gcal_today() if self.google else MockProvider.gcal_today())
        for e in items:
            self.list.addItem(QListWidgetItem(f"{e['time']}  {e['title']}  @ {e['location']}"))

class ProjectTimelinePanel(Panel):
    def __init__(self):
        super().__init__("프로젝트 타임라인")
        self.list = QListWidget(); self.vbox.addWidget(self.list)
        self.refresh()
    def refresh(self):
        self.list.clear()
        for due, item in [("08/20","Ship PyNote MVP"),("08/25","Integrate Gmail real API")]:
            self.list.addItem(QListWidgetItem(f"{due} — {item}"))