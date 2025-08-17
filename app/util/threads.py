from __future__ import annotations
from PySide6.QtCore import QObject, QThread, pyqtSignal

class Worker(QObject):
    finished = pyqtSignal(object)
    failed = pyqtSignal(Exception)

    def __init__(self, fn, *args, **kwargs):
        super().__init__()
        self.fn, self.args, self.kwargs = fn, args, kwargs

    def run(self):
        try:
            result = self.fn(*self.args, **self.kwargs)
            self.finished.emit(result)
        except Exception as e:
            self.failed.emit(e)

def run_in_thread(fn, callback, errback=None, *args, **kwargs):
    thread = QThread()
    worker = Worker(fn, *args, **kwargs)
    worker.moveToThread(thread)
    thread.started.connect(worker.run)
    worker.finished.connect(callback)
    if errback:
        worker.failed.connect(errback)
    worker.finished.connect(thread.quit)
    worker.finished.connect(worker.deleteLater)
    thread.finished.connect(thread.deleteLater)
    thread.start()
    return thread