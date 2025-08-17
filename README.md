# PyNote - 개인 지식 통합 대시보드

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![PySide6](https://img.shields.io/badge/PySide6-6.9.1+-green.svg)](https://doc.qt.io/qtforpython/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

PyNote는 여러 플랫폼에 분산된 개인 지식과 할 일을 하나의 데스크톱 애플리케이션으로 통합하는 **Mission Control 스타일의 대시보드**입니다.

## ✨ 주요 기능

### 🎯 3열 Mission Control 레이아웃
- **왼쪽 (Action)**: Gmail, Google Calendar, 프로젝트 타임라인
- **중앙 (Content)**: YouTube 플레이어, 커뮤니티 피드, 뉴스
- **오른쪽 (Context)**: 클라우드 파일 탐색기, Markdown 뷰어

### 🔗 통합 서비스
- **Google**: Gmail, Calendar, Drive
- **커뮤니티**: DCInside, Reddit, Discord
- **미디어**: YouTube, RSS 뉴스
- **클라우드**: Google Drive, OneDrive (예정)

## 🚀 빠른 시작

### 1. 환경 설정
```bash
# 저장소 클론
git clone https://github.com/yourusername/pynote.git
cd pynote

# Python 3.10+ 설치 확인
python --version

# Poetry 설치 (권장)
pip install poetry
poetry install

# 또는 pip 사용
pip install -r requirements.txt
```

### 2. Google API 설정
1. [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트 생성
2. Gmail, Calendar, Drive API 활성화
3. **OAuth 클라이언트 ID (데스크톱)** 생성
4. `credentials.json` 파일을 프로젝트 루트에 다운로드

### 3. 실행
```bash
# Poetry 사용
poetry run python -m app.main

# 또는 pip 사용
python -m app.main

# Windows에서 배치 파일 사용
run.bat
```

최초 실행 시 브라우저에서 Google 계정 인증 후 `token.json` 파일이 자동 생성됩니다.

## 🏗️ 프로젝트 구조

```
pynote/
├── app/
│   ├── main.py              # 메인 애플리케이션 진입점
│   ├── config.py            # 설정 및 환경 변수 관리
│   ├── providers/           # 외부 서비스 연동
│   │   ├── google.py        # Google API 통합 (Gmail, Calendar, Drive)
│   │   └── mocks.py         # 폴백용 목업 데이터
│   ├── ui/                  # 사용자 인터페이스
│   │   ├── columns.py       # 3열 레이아웃 정의
│   │   ├── panels_action.py # 왼쪽 패널 (Gmail, Calendar, Timeline)
│   │   ├── panels_content.py # 중앙 패널 (YouTube, 피드)
│   │   └── panels_context.py # 오른쪽 패널 (파일 탐색기)
│   └── util/
│       └── threads.py       # 백그라운드 작업 처리
├── docs/                    # 문서
├── resources/               # 리소스 파일
├── pynote.yaml             # 사용자 설정 파일
├── pyproject.toml          # Poetry 프로젝트 설정
└── requirements.txt         # Python 의존성
```

## 🔧 기술 스택

### 핵심 프레임워크
- **Python 3.10+**: 메인 프로그래밍 언어
- **PySide6 6.9.1+**: 데스크톱 GUI 프레임워크 (LGPL 라이선스)
- **PySide6-WebEngine**: 웹 콘텐츠 임베딩 (YouTube 등)

### API 및 데이터
- **Google APIs**: Gmail, Calendar, Drive
- **웹 크롤링**: requests, BeautifulSoup4
- **RSS 파싱**: feedparser
- **설정 관리**: PyYAML, python-dotenv

### 개발 도구
- **Poetry**: 의존성 및 패키지 관리
- **pytest**: 테스트 프레임워크

## 📱 사용자 인터페이스

### Action Column (왼쪽)
- **Gmail 패널**: 중요/읽지 않은 메일 표시
- **Calendar 패널**: 오늘의 일정 및 이벤트
- **프로젝트 타임라인**: 마감일 및 할 일 관리

### Content Column (중앙)
- **YouTube 플레이어**: 웹뷰 기반 영상 재생
- **커뮤니티 피드**: DCInside, Reddit, Discord
- **뉴스 피드**: RSS 기반 최신 뉴스

### Context Column (오른쪽)
- **클라우드 탐색기**: Google Drive 파일 트리
- **Markdown 뷰어**: .md 파일 내용 표시

## ⚙️ 설정

### pynote.yaml 설정 예시
```yaml
ui:
  dcinside_gallery: "baseball_new"
  rss_urls:
    - "https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko"
    - "https://rss.donga.com/total.xml"

providers:
  google:
    scopes:
      - "https://www.googleapis.com/auth/gmail.readonly"
      - "https://www.googleapis.com/auth/calendar.readonly"
      - "https://www.googleapis.com/auth/drive.metadata.readonly"
```

## 🔄 자동 새로고침

- **5분 간격**: 모든 패널 데이터 자동 업데이트
- **수동 새로고침**: File → Refresh all 메뉴
- **개별 새로고침**: 각 패널의 refresh() 메서드

## 🚧 개발 상태

### ✅ 완성된 기능
- [x] 기본 UI 프레임워크 및 3열 레이아웃
- [x] Google API 연동 (인증, Gmail, Calendar, Drive)
- [x] YouTube 플레이어 임베딩
- [x] 탭 기반 콘텐츠 패널
- [x] 자동 새로고침 시스템
- [x] 목업 데이터 제공자 (API 사용 불가 시)
- [x] 클라우드 파일 탐색기
- [x] Markdown 뷰어

### 🚧 개발 중인 기능
- [ ] Slack, Discord, Reddit API 연동
- [ ] 웹 크롤링 기반 DCInside 데이터 수집
- [ ] RSS 뉴스 피드 파싱
- [ ] 파일 다운로드 및 읽기

### 📋 예정된 기능
- [ ] OneDrive, Obsidian 연동
- [ ] GitHub, Tistory API 연동
- [ ] 플러그인 시스템
- [ ] 테마 및 UI 커스터마이징
- [ ] 백그라운드 스레드 처리 개선

## 🐛 문제 해결

### Google API 인증 오류
```bash
# credentials.json 파일이 프로젝트 루트에 있는지 확인
ls -la credentials.json

# token.json 삭제 후 재인증
rm token.json
python -m app.main
```

### PySide6 설치 오류
```bash
# Poetry 사용 권장
poetry install

# 또는 pip 사용
pip install -r requirements.txt
```

### 의존성 충돌
```bash
# 가상환경 사용 권장
poetry shell
# 또는
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.