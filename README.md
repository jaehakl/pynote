# PyNote

PyNote는 GitHub 레포지토리를 탐색하고 노트를 작성할 수 있는 풀스택 웹 애플리케이션입니다.

## 🚀 프로젝트 개요

PyNote는 다음과 같은 기능을 제공합니다:
- GitHub 레포지토리 파일 탐색
- README 파일 자동 렌더링
- 마크다운 파일 지원
- 모던한 React 기반 UI
- FastAPI 기반 백엔드 API

## 🏗️ 프로젝트 구조

```
pynote/
├── apps/
│   └── note/
│       ├── api/                 # FastAPI 백엔드
│       │   ├── app/
│       │   │   ├── main.py     # 메인 API 서버
│       │   │   ├── db.py       # 데이터베이스 설정
│       │   │   ├── initserver.py # 서버 초기화
│       │   │   └── service/
│       │   │       └── github_service.py # GitHub API 서비스
│       │   ├── pyproject.toml  # Python 의존성
│       │   └── README.md       # API 상세 문서
│       └── ui/                  # React 프론트엔드
│           ├── src/
│           │   ├── App.jsx      # 메인 앱 컴포넌트
│           │   ├── pages/
│           │   │   └── github.jsx # GitHub 탐색기 컴포넌트
│           │   └── api/
│           │       └── api.js   # API 클라이언트
│           ├── package.json     # Node.js 의존성
│           └── vite.config.js   # Vite 설정
├── pnpm-workspace.yaml          # pnpm 워크스페이스 설정
└── README.md                    # 이 파일
```

## 🛠️ 기술 스택

### 백엔드
- **Python 3.11+**
- **FastAPI** - 현대적이고 빠른 웹 프레임워크
- **SQLAlchemy** - ORM 및 데이터베이스 추상화
- **Uvicorn** - ASGI 서버
- **pgvector** - 벡터 데이터베이스 지원
- **Poetry** - 의존성 관리

### 프론트엔드
- **React 19** - 사용자 인터페이스 라이브러리
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **RSuite** - React UI 컴포넌트 라이브러리
- **React Router** - 클라이언트 사이드 라우팅
- **React Markdown** - 마크다운 렌더링
- **Axios** - HTTP 클라이언트

## 📋 요구사항

- Python 3.11 이상
- Node.js 18 이상
- pnpm 패키지 매니저

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd pynote
```

### 2. 백엔드 실행
```bash
cd apps/note/api
poetry install
poetry run python -m uvicorn app.main:app --reload
```

### 3. 프론트엔드 실행
```bash
cd apps/note/ui
pnpm install
pnpm dev
```

### 4. 전체 프로젝트 실행 (워크스페이스)
```bash
# 루트 디렉토리에서
pnpm install
pnpm run dev:note
```

## 🔧 환경 설정

### GitHub API 설정
GitHub API 요청 제한을 해결하기 위해 Personal Access Token을 설정할 수 있습니다.

1. **GitHub Personal Access Token 생성**
   - GitHub Settings > Developer settings > Personal access tokens
   - "Generate new token" 클릭
   - `public_repo` 권한 부여

2. **환경 변수 설정**
   ```bash
   # apps/note/api/.env 파일 생성
   GITHUB_ACCESS_TOKEN=your_github_personal_access_token_here
   ```

## ⚠️ 보안 주의사항

**이 프로젝트는 로컬 개발 환경에서만 사용하도록 설계되었습니다.**

- GitHub Personal Access Token이 클라이언트 사이드에 노출될 수 있습니다
- 프로덕션 환경에서 사용 시 보안 위험이 있습니다
- 개발 및 개인 학습 목적으로만 사용
- GitHub 토큰은 반드시 `.env` 파일에 저장하고 `.gitignore`에 포함
- 토큰을 소스코드에 직접 입력하지 마세요


## 🎯 주요 기능

### GitHub 레포지토리 탐색
- 사용자명과 레포지토리명으로 접근
- 파일 및 디렉토리 구조 탐색
- 브레드크럼 네비게이션

### 마크다운 지원
- README.md 파일 자동 감지 및 렌더링
- GitHub Flavored Markdown (GFM) 지원
- 한글 인코딩 자동 처리

### 사용자 인터페이스
- 반응형 디자인
- 모던한 UI 컴포넌트
- 직관적인 네비게이션


## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 👨‍💻 개발자

- **Jaehak Lee** - [leejaehak87@gmail.com](mailto:leejaehak87@gmail.com)

## 📞 지원

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.
