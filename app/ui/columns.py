from __future__ import annotations
from PySide6.QtWidgets import QWidget, QVBoxLayout, QTabWidget
from ..config import CONFIG
from .panels_action import GmailPanel, TodayCalendarPanel, ProjectTimelinePanel
from .panels_content import YouTubePlayer, YouTubeList, DCInside, Reddit, Discord, RSSNews
from .panels_context import CloudTree, MDViewer
from ..providers import MockProvider

class ActionColumn(QWidget):
    def __init__(self, google=None):
        super().__init__()
        v = QVBoxLayout(self); v.setContentsMargins(6,6,6,6)
        v.addWidget(GmailPanel(google))
        v.addWidget(TodayCalendarPanel(google))
        v.addWidget(ProjectTimelinePanel())
        v.addStretch(1)

class ContentColumn(QWidget):
    def __init__(self):
        super().__init__()
        v = QVBoxLayout(self); v.setContentsMargins(6,6,6,6)
        self.player = YouTubePlayer(); v.addWidget(self.player)
        tabs = QTabWidget(); v.addWidget(tabs,1)
        gallery = CONFIG.get("ui",{}).get("dcinside_gallery","baseball_new")
        rss = CONFIG.get("ui",{}).get("rss_urls", ["https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko"]) 
        self.dc = DCInside(gallery)
        self.reddit = Reddit()
        self.discord = Discord()
        self.rss = RSSNews(rss)
        self.ytlist = YouTubeList(); self.ytlist.videoSelected.connect(self.player.load_video)
        tabs.addTab(self.dc, "DCInside"); tabs.addTab(self.reddit, "Reddit"); tabs.addTab(self.discord, "Discord"); tabs.addTab(self.rss, "News"); tabs.addTab(self.ytlist, "YouTube List")

class ContextColumn(QWidget):
    def __init__(self, google=None):
        super().__init__()
        v = QVBoxLayout(self); v.setContentsMargins(6,6,6,6)
        tree = (google.drive_tree() if google else MockProvider.drive_tree())
        self.cloud = CloudTree("클라우드 파일 탐색기", tree); v.addWidget(self.cloud)
        self.md = MDViewer(); v.addWidget(self.md)
        v.addStretch(1)
        self.cloud.fileSelected.connect(self._load_md_mock)
    def _load_md_mock(self, virtual_path: str):
        self.md.set_markdown(f"# {virtual_path}\n\n_Replace with real download & read via Drive API (files.get + media download)._\n")