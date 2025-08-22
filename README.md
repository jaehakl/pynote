# PyNote

PyNote는 GitHub, YouTube, Tistory 등 다양한 플랫폼의 콘텐츠를 통합하여 보여주는 풀스택 웹 애플리케이션입니다.

## 🚀 프로젝트 개요

PyNote는 다음과 같은 기능을 제공합니다:

### 📚 **GitHub 통합**
- GitHub 레포지토리 파일 탐색 및 구조 표시
- README.md 파일 자동 렌더링 (Markdown 지원)
- 다중 레포지토리 동시 표시
- GitHub API를 통한 실시간 데이터 연동

### 🎥 **YouTube 통합**
- YouTube 재생목록 표시 및 관리
- 영상 정보 및 통계 표시
- YouTube iframe API를 통한 임베드 플레이어
- 페이지네이션 지원 (최대 50개 영상)

### 📝 **Tistory 블로그 통합**
- RSS 피드 파싱 및 표시
- 블로그 포스트 목록 및 요약
- HTML 엔티티 디코딩 지원
- 한국어 날짜 포맷팅

### 🎨 **사용자 인터페이스**
- 반응형 디자인과 모던한 UI 컴포넌트
- 직관적인 네비게이션 및 라우팅
- 실시간 콘텐츠 업데이트

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
│           │   ├── components/  # UI 컴포넌트들
│           │   │   ├── github.jsx      # GitHub 탐색기
│           │   │   ├── youtube.jsx     # YouTube 플레이어
│           │   │   ├── tistory.jsx     # Tistory RSS
│           │   │   └── Navbar.jsx      # 네비게이션
│           │   ├── pages/       # 페이지 컴포넌트들
│           │   │   └── github-multi.jsx # 다중 GitHub 표시
│           │   ├── api/         # API 클라이언트
│           │   │   └── api.js   # HTTP 요청 함수들
│           │   ├── App.jsx      # 메인 앱 컴포넌트
│           │   └── main.jsx     # 애플리케이션 진입점
│           ├── package.json     # Node.js 의존성
│           ├── vite.config.js   # Vite 설정
│           └── README.md        # UI 상세 문서
├── pnpm-workspace.yaml          # pnpm 워크스페이스 설정
└── README.md                    # 이 파일
```

## 🛠️ 기술 스택

### 백엔드
- **Python 3.11+**
- **FastAPI** - 현대적이고 빠른 웹 프레임워크
- **SQLAlchemy** - ORM 및 데이터베이스 추상화
- **Uvicorn** - ASGI 서버
- **Poetry** - 의존성 관리

### 프론트엔드
- **React 19** - 최신 React 버전 사용
- **Vite 5.0** - 빠른 개발 서버 및 빌드 도구
- **RSuite 5.78** - React UI 컴포넌트 라이브러리
- **React Router DOM 7.6** - 클라이언트 사이드 라우팅
- **React Markdown 10.1** - 마크다운 렌더링
- **Axios 1.8** - HTTP 클라이언트
- **Less 4.3** - CSS 전처리기

### 외부 API 연동
- **GitHub API v3** - 레포지토리 콘텐츠 및 메타데이터
- **YouTube Data API v3** - 재생목록 및 영상 정보
- **Tistory RSS** - 블로그 포스트 피드

## 📋 요구사항

- **Python 3.11 이상**
- **Node.js 18 이상**
- **pnpm 패키지 매니저** (권장)
- **GitHub Personal Access Token** (GitHub 기능 사용 시)
- **YouTube Data API v3 키** (YouTube 기능 사용 시)

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd pynote
```

### 2. 전체 프로젝트 실행 (워크스페이스)
```bash
# 루트 디렉토리에서
pnpm install
pnpm run dev:note
```

### 3. 개별 실행

#### 백엔드 실행
```bash
cd apps/note/api
poetry install
poetry run python -m uvicorn app.main:app --reload
```

#### 프론트엔드 실행
```bash
cd apps/note/ui
pnpm install
pnpm dev
```

### 4. Windows 사용자를 위한 빠른 실행
```bash
# 루트 디렉토리
run.bat

# 또는 개별 실행
cd apps/note/ui && run.bat
```

## 🔧 환경 설정

### 1. 환경 변수 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:

> 💡 **팁**: `env.example` 파일을 참고하여 필요한 환경 변수를 설정하세요.

```env
# GitHub API 설정
GITHUB_ACCESS_TOKEN=your_github_personal_access_token_here

# YouTube Data API v3 설정
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 2. GitHub Personal Access Token 생성

1. **GitHub Settings > Developer settings > Personal access tokens**
2. **"Generate new token" 클릭**
3. **`public_repo` 권한 부여** (최소 권한)

### 3. YouTube Data API v3 키 생성

1. **Google Cloud Console**에서 프로젝트 생성
2. **YouTube Data API v3** 활성화
3. **API 키 생성**

## ⚠️ 보안 주의사항

**이 프로젝트는 로컬 개발 환경에서만 사용하도록 설계되었습니다.**

- ✅ **API 키는 환경 변수로 관리**
- ✅ **`.env` 파일이 `.gitignore`에 포함됨**
- ❌ **소스코드에 직접 입력하지 마세요**
- ❌ **프로덕션 환경에서 사용 시 보안 위험**

## 🎯 주요 기능

### 메인 대시보드 (`/`)
- **좌측**: YouTube 재생목록 표시
- **중앙**: GitHub 레포지토리 탐색기
- **우측**: Tistory 블로그 RSS 피드

### 개별 페이지
- **`/github`** - GitHub 관련 기능만 표시
- **`/blog`** - Tistory 블로그만 표시  
- **`/youtube`** - YouTube 재생목록만 표시

### GitHub 레포지토리 탐색
- 사용자명과 레포지토리명으로 접근
- 파일 및 디렉토리 구조 탐색
- 브레드크럼 네비게이션
- README.md 파일 자동 감지 및 렌더링

### 마크다운 지원
- GitHub Flavored Markdown (GFM) 지원
- 한글 인코딩 자동 처리
- 코드 하이라이팅

## 🔌 API 연동

### GitHub API
- **인증**: Personal Access Token 사용
- **기능**: 레포지토리 콘텐츠, 검색, 사용자 정보
- **제한**: 시간당 5,000 요청 (인증 시)

### YouTube Data API v3
- **인증**: API 키 사용
- **기능**: 재생목록, 영상 정보, 통계
- **제한**: 일일 할당량 (기본 10,000 단위)

### Tistory RSS
- **프록시**: AllOrigins 서비스로 CORS 우회
- **기능**: RSS 피드 파싱 및 표시

## 🎨 커스터마이징

### 스타일 수정
- `src/components/*.css` 파일에서 컴포넌트별 스타일 수정
- `src/App.less`에서 전역 스타일 수정

### 컴포넌트 수정
- 각 기능별로 독립적인 컴포넌트 구조
- Props를 통한 설정 가능

### 환경 변수 추가
- `vite.config.js`에서 새로운 환경 변수 정의
- `src/api/api.js`에서 API 호출 함수 추가

## 📦 빌드

### 프로덕션 빌드
```bash
cd apps/note/ui
pnpm build
```

### 빌드 미리보기
```bash
cd apps/note/ui
pnpm preview
```

## 🧪 개발 도구

### 코드 품질
```bash
cd apps/note/ui
pnpm lint
```

### 개발 서버
- Vite의 Hot Module Replacement 지원
- 실시간 코드 변경 반영
- 빠른 개발 서버 시작

## 🆘 문제 해결

### 일반적인 문제들

**GitHub API 제한 도달**
- GitHub Personal Access Token의 권한 확인
- API 요청 빈도 조절

**YouTube API 할당량 초과**
- YouTube Data API v3 할당량 확인
- API 키 교체 또는 할당량 증가 요청

**CORS 오류**
- 백엔드 프록시 설정 확인
- 환경 변수 설정 확인

### 로그 확인
- 브라우저 개발자 도구 콘솔에서 오류 메시지 확인
- 네트워크 탭에서 API 요청/응답 상태 확인

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 👨‍💻 개발자

- **Jaehak Lee** - [leejaehak87@gmail.com](mailto:leejaehak87@gmail.com)

## 📞 지원

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

## 📚 추가 문서

- [UI 상세 문서](apps/note/ui/README.md) - 프론트엔드 상세 가이드
