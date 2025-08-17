from __future__ import annotations
from PySide6.QtCore import Signal, Qt, QUrl
from PySide6.QtWidgets import QGroupBox, QVBoxLayout, QListWidget, QListWidgetItem, QTabWidget
from PySide6.QtWebEngineWidgets import QWebEngineView
from ..providers import mocks as Providers

class Panel(QGroupBox):
    def __init__(self, title: str):
        super().__init__(title)
        self.vbox = QVBoxLayout(self)

class YouTubePlayer(Panel):
    def __init__(self):
        super().__init__("YouTube Player")
        self.web = QWebEngineView(); self.web.setMinimumHeight(260)
        self.vbox.addWidget(self.web)
        self.load_video("dQw4w9WgXcQ")
    def load_video(self, vid: str):
        self.web.setUrl(QUrl(f"https://www.youtube.com/embed/{vid}?autoplay=0"))

class YouTubeList(Panel):
    videoSelected = Signal(str)
    def __init__(self):
        super().__init__("YouTube — 새 영상")
        self.list = QListWidget(); self.vbox.addWidget(self.list)
        self.refresh(); self.list.itemClicked.connect(self._on)
    def refresh(self):
        self.list.clear()
        #for v in Providers.youtube_my_list():
        #    it = QListWidgetItem(f"▶ {v['title']} ({v['video_id']})"); it.setData(Qt.ItemDataRole.UserRole, v['video_id'])
        #    self.list.addItem(it)
    def _on(self, it):
        vid = it.data(Qt.ItemDataRole.UserRole)
        if vid: self.videoSelected.emit(str(vid))

class DCInside(Panel):
    def __init__(self, gallery: str):
        super().__init__(f"디시인사이드 — {gallery}")
        self.gallery = gallery
        self.list = QListWidget(); self.vbox.addWidget(self.list)
        self.refresh()
    def refresh(self):
        self.list.clear()
        #for p in Providers.dcinside_concept(self.gallery):
        #    it = QListWidgetItem(p['title']); self.list.addItem(it)

class Reddit(Panel):
    def __init__(self, subs=None):
        super().__init__("Reddit — Hot")
        self.subs = subs or ["python","technology"]
        self.list = QListWidget(); self.vbox.addWidget(self.list)
        self.refresh()
    def refresh(self):
        self.list.clear()
        #for r in Providers.reddit_hot(self.subs):
        #    self.list.addItem(QListWidgetItem(f"r/{r['sub']}: {r['title']}"))

class Discord(Panel):
    def __init__(self):
        super().__init__("Discord — 최신 메시지")
        self.list = QListWidget(); self.vbox.addWidget(self.list)
        self.refresh()
    def refresh(self):
        self.list.clear()
        #for m in Providers.discord_latest():
        #    self.list.addItem(QListWidgetItem(f"#{m['channel']} — {m['user']}: {m['text']}"))

class RSSNews(Panel):
    def __init__(self, urls):
        super().__init__("뉴스 — RSS")
        self.urls = urls
        self.list = QListWidget(); self.vbox.addWidget(self.list)
        self.refresh()
    def refresh(self):
        self.list.clear()
        #for n in Providers.rss_headlines(self.urls):
        #    it = QListWidgetItem(n['title']); self.list.addItem(it)