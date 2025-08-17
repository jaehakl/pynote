from __future__ import annotations
from PySide6.QtWidgets import QGroupBox, QVBoxLayout, QTreeWidget, QTreeWidgetItem, QTextBrowser
from PySide6.QtCore import Signal

class CloudTree(QGroupBox):
    fileSelected = Signal(str)
    def __init__(self, title: str, tree: dict):
        super().__init__(title)
        self.v = QVBoxLayout(self)
        self.view = QTreeWidget(); self.view.setHeaderLabels(["Name"])
        self.v.addWidget(self.view)
        self._populate(tree)
        self.view.itemDoubleClicked.connect(self._open)
    def _populate(self, tree: dict):
        self.view.clear()
        def add_nodes(parent, subtree: dict):
            for name, child in subtree.items():
                item = QTreeWidgetItem([name]); parent.addChild(item)
                if isinstance(child, dict): add_nodes(item, child)
        for root_name, subtree in tree.items():
            root = QTreeWidgetItem([root_name]); self.view.addTopLevelItem(root)
            if isinstance(subtree, dict): add_nodes(root, subtree)
        self.view.expandToDepth(1)
    def _open(self, item, _):
        parts=[]; cur=item
        while cur is not None:
            parts.append(cur.text(0)); cur=cur.parent()
        path="/".join(reversed(parts))
        if path.lower().endswith(".md"): self.fileSelected.emit(path)

class MDViewer(QGroupBox):
    def __init__(self):
        super().__init__("Markdown Viewer")
        self.v = QVBoxLayout(self)
        self.view = QTextBrowser(); self.v.addWidget(self.view)
    def set_markdown(self, text: str):
        self.view.setMarkdown(text)