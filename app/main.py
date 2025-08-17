from __future__ import annotations
import sys
from PySide6.QtCore import Qt, QTimer
from PySide6.QtWidgets import QApplication, QMainWindow, QSplitter
from PySide6.QtGui import QAction
from .config import APP_TITLE
from .ui.columns import ActionColumn, ContentColumn, ContextColumn
from .providers.google import GoogleProvider

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle(APP_TITLE); self.resize(1400,900)

        # Try Google auth. If credentials.json missing, show helpful error on first use.
        self.google = None
        try:
            self.google = GoogleProvider()
        except Exception as e:
            print("[INFO] Google auth unavailable:", e)

        splitter = QSplitter(Qt.Orientation.Horizontal); splitter.setChildrenCollapsible(False)
        self.left = ActionColumn(self.google)
        self.center = ContentColumn()
        self.right = ContextColumn(self.google)
        splitter.addWidget(self.left); splitter.addWidget(self.center); splitter.addWidget(self.right)
        splitter.setSizes([300,750,350])
        self.setCentralWidget(splitter)

        mb = self.menuBar(); filem = mb.addMenu("File")
        refresh = QAction("Refresh all", self); refresh.triggered.connect(self.refresh_all); filem.addAction(refresh)

        self.timer = QTimer(self); self.timer.setInterval(1000*60*5); self.timer.timeout.connect(self.refresh_all); self.timer.start()

    def refresh_all(self):
        try:
            for w in self.left.findChildren(object):
                if hasattr(w, "refresh"): w.refresh()
            for w in [self.center.dc, self.center.reddit, self.center.discord, self.center.rss, self.center.ytlist]:
                w.refresh()
        except Exception as e:
            print("[WARN] refresh:", e)


def main():
    app = QApplication(sys.argv); app.setApplicationName(APP_TITLE)
    win = MainWindow(); win.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()