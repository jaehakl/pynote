from __future__ import annotations
import os, datetime as dt
from typing import List, Dict, Any
from zoneinfo import ZoneInfo

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
CRED_PATH = os.path.join(BASE_DIR, "credentials.json")
TOKEN_PATH = os.path.join(BASE_DIR, "token.json")

# Scopes: Gmail read-only, Calendar read-only, Drive metadata read-only
SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/drive.metadata.readonly",
]

class GoogleProvider:
    def __init__(self):
        self.creds = self._load_creds()
        self.gmail = build("gmail", "v1", credentials=self.creds, cache_discovery=False)
        self.calendar = build("calendar", "v3", credentials=self.creds, cache_discovery=False)
        self.drive = build("drive", "v3", credentials=self.creds, cache_discovery=False)

    def _load_creds(self) -> Credentials:
        creds = None
        if os.path.exists(TOKEN_PATH):
            creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                if not os.path.exists(CRED_PATH):
                    raise FileNotFoundError("credentials.json not found. Place it in project root.")
                flow = InstalledAppFlow.from_client_secrets_file(CRED_PATH, SCOPES)
                creds = flow.run_local_server(port=0)
            with open(TOKEN_PATH, "w", encoding="utf-8") as token:
                token.write(creds.to_json())
        return creds

    # ---------- Gmail ----------
    def gmail_list(self, labels_to_fetch: list = ["UNREAD", "IMPORTANT"], limit: int = 10) -> List[Dict[str, str]]:
        """최신순으로 Gmail 목록을 가져옵니다. Google API 사용 가능 시 실제 데이터를,
        아니면 목업을 반환합니다."""
        try:
            # Lazy import: 설치돼 있지 않으면 예외 → 목업으로 폴백
            from google.oauth2.credentials import Credentials
            from google_auth_oauthlib.flow import InstalledAppFlow
            from google.auth.transport.requests import Request
            from googleapiclient.discovery import build

            base = BASE_DIR
            cred_path = os.path.join(base, "credentials.json")
            token_path = os.path.join(base, "token.json")
            scopes = ["https://www.googleapis.com/auth/gmail.readonly"]

            creds = None
            if os.path.exists(token_path):
                creds = Credentials.from_authorized_user_file(token_path, scopes)
            if not creds or not creds.valid:
                if creds and creds.expired and creds.refresh_token:
                    creds.refresh(Request())
                else:
                    if not os.path.exists(cred_path):
                        raise FileNotFoundError("credentials.json not found for Gmail")
                    flow = InstalledAppFlow.from_client_secrets_file(cred_path, scopes)
                    creds = flow.run_local_server(port=0)
                with open(token_path, "w", encoding="utf-8") as f:
                    f.write(creds.to_json())

            service = build("gmail", "v1", credentials=creds, cache_discovery=False)

            # 라벨 이름 → ID 매핑 (이름이 그대로 ID여도 안전)
            labels_resp = service.users().labels().list(userId="me").execute()
            name_to_id = {l.get("name"): l.get("id") for l in labels_resp.get("labels", [])}
            label_ids = [name_to_id.get(l) for l in labels_to_fetch]

            resp = service.users().messages().list(
                userId="me", labelIds=label_ids, maxResults=limit
            ).execute()

            msgs = []
            for m in resp.get("messages", []):
                full = service.users().messages().get(
                    userId="me",
                    id=m["id"],
                    format="metadata",
                    metadataHeaders=["From", "Subject", "Date"]
                ).execute()
                hdrs = {h["name"]: h["value"] for h in full.get("payload", {}).get("headers", [])}
                internal = int(full.get("internalDate", "0"))
                msgs.append({
                    "from": hdrs.get("From", ""),
                    "subject": hdrs.get("Subject", ""),
                    "snippet": full.get("snippet", ""),
                    "internalDate": internal,
                })

            # ★ 최신순(내림차순) 보장
            msgs.sort(key=lambda x: x.get("internalDate", 0), reverse=True)

            return [
                {"from": m["from"], "subject": m["subject"], "snippet": m["snippet"]}
                for m in msgs
            ][:limit]

        except Exception as e:
            print("[INFO] Gmail fallback:", e)
            return []

    # ---------- Calendar (today) ----------
    def gcal_today(self, timezone: str = "Asia/Seoul") -> List[Dict[str, str]]:
        tz = ZoneInfo(timezone)
        now = dt.datetime.now(tz)
        start = dt.datetime(now.year, now.month, now.day, 0, 0, 0, tzinfo=tz).isoformat()
        end = (dt.datetime(now.year, now.month, now.day, 23, 59, 59, tzinfo=tz)).isoformat()
        events = []
        resp = self.calendar.events().list(calendarId="primary", timeMin=start, timeMax=end, singleEvents=True, orderBy="startTime").execute()
        for e in resp.get("items", []):
            start_time = e.get("start", {}).get("dateTime") or e.get("start", {}).get("date")
            loc = e.get("location", "")
            title = e.get("summary", "(제목 없음)")
            # Display HH:MM if datetime, else all-day
            try:
                t = dt.datetime.fromisoformat(start_time)
                disp = t.strftime("%H:%M")
            except Exception:
                disp = "(하루 종일)"
            events.append({"time": disp, "title": title, "location": loc})
        return events

    # ---------- Drive tree (metadata) ----------
    def drive_tree(self) -> Dict[str, Any]:
        """Google Drive의 루트와 1레벨 하위 폴더/파일을 트리로 반환합니다.
        Google API 사용 불가 시 기존 목업으로 폴백합니다."""
        try:
            from google.oauth2.credentials import Credentials
            from google_auth_oauthlib.flow import InstalledAppFlow
            from google.auth.transport.requests import Request
            from googleapiclient.discovery import build

            base = BASE_DIR
            cred_path = os.path.join(base, "credentials.json")
            token_path = os.path.join(base, "token.json")
            scopes = ["https://www.googleapis.com/auth/drive.metadata.readonly"]

            creds = None
            if os.path.exists(token_path):
                creds = Credentials.from_authorized_user_file(token_path, scopes)
            if not creds or not creds.valid:
                if creds and creds.expired and creds.refresh_token:
                    creds.refresh(Request())
                else:
                    if not os.path.exists(cred_path):
                        raise FileNotFoundError("credentials.json not found for Drive")
                    flow = InstalledAppFlow.from_client_secrets_file(cred_path, scopes)
                    creds = flow.run_local_server(port=0)
                with open(token_path, "w", encoding="utf-8") as f:
                    f.write(creds.to_json())

            drive = build("drive", "v3", credentials=creds, cache_discovery=False)

            def list_children(parent_id: str) -> List[Dict[str, Any]]:
                q = f"'{parent_id}' in parents and trashed=false"
                fields = "nextPageToken, files(id, name, mimeType)"
                items: List[Dict[str, Any]] = []
                page = None
                while True:
                    resp = drive.files().list(q=q, fields=fields, pageSize=200, pageToken=page).execute()
                    items.extend(resp.get("files", []))
                    page = resp.get("nextPageToken")
                    if not page:
                        break
                return items

            tree: Dict[str, Any] = {"Google Drive": {}}
            # root은 특별히 'root' ID로 지정
            root_children = list_children("root")
            for f in root_children:
                name = f["name"]
                mime = f["mimeType"]
                if mime == "application/vnd.google-apps.folder":
                    # 1레벨 폴더의 자식까지 (2단계) 구성
                    children = list_children(f["id"])
                    subtree: Dict[str, Any] = {}
                    for c in children:
                        subtree[c["name"]] = None
                    tree["Google Drive"][name] = subtree
                else:
                    tree["Google Drive"][name] = None

            return tree

        except Exception as e:
            print("[INFO] Drive fallback:", e)
            # 기존 목업
            return {
                "Google Drive": {
                    "Reports": {"budget.xlsx": None, "plan.docx": None},
                    "Notes": {"ideas.md": None},
                },
                "OneDrive": {
                    "Vault": {"daily.md": None},
                },
            }