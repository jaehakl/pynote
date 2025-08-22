# PyNote UI

PyNote의 프론트엔드 사용자 인터페이스 애플리케이션입니다. GitHub, YouTube, Tistory 등 다양한 플랫폼의 콘텐츠를 통합하여 보여주는 대시보드 형태의 웹 애플리케이션입니다.

## 🚀 주요 기능

### 📚 GitHub 통합
- GitHub 레포지토리 콘텐츠 탐색
- README.md 파일 자동 렌더링 (Markdown 지원)
- 파일 및 폴더 구조 탐색
- 다중 레포지토리 동시 표시
- GitHub API를 통한 실시간 데이터 연동

### 🎥 YouTube 통합
- YouTube 재생목록 표시
- 영상 정보 및 통계 표시
- YouTube iframe API를 통한 임베드 플레이어
- 페이지네이션 지원 (최대 50개 영상)

### 📝 Tistory 블로그 통합
- RSS 피드 파싱 및 표시
- 블로그 포스트 목록 및 요약
- HTML 엔티티 디코딩 지원
- 한국어 날짜 포맷팅

## 🛠️ 기술 스택

### Frontend Framework
- **React 19.0.0** - 최신 React 버전 사용
- **React Router DOM 7.6.0** - 클라이언트 사이드 라우팅
- **RSuite 5.78.0** - React UI 컴포넌트 라이브러리

### Build Tools
- **Vite 5.0.0** - 빠른 개발 서버 및 빌드 도구
- **Less 4.3.0** - CSS 전처리기

### API & Data
- **Axios 1.8.3** - HTTP 클라이언트
- **React Markdown 10.1.0** - Markdown 렌더링
- **Remark & Remark GFM** - Markdown 파싱 및 GitHub Flavored Markdown 지원

### Development
- **ESLint** - 코드 품질 관리
- **Hot Module Replacement** - 개발 시 실시간 코드 반영

## 📁 프로젝트 구조

```
src/
├── api/
│   └── api.js              # API 호출 함수들
├── components/
│   ├── github.jsx          # GitHub 레포지토리 탐색기
│   ├── github.css          # GitHub 컴포넌트 스타일
│   ├── youtube.jsx         # YouTube 재생목록 컴포넌트
│   ├── youtube.css         # YouTube 컴포넌트 스타일
│   ├── tistory.jsx         # Tistory RSS 피드 컴포넌트
│   ├── tistory.css         # Tistory 컴포넌트 스타일
│   ├── Navbar.jsx          # 네비게이션 바
│   └── Navbar.css          # 네비게이션 바 스타일
├── pages/
│   ├── github-multi.jsx    # 다중 GitHub 레포지토리 표시
│   └── github-multi.css    # 다중 GitHub 페이지 스타일
├── App.jsx                 # 메인 애플리케이션 컴포넌트
├── App.less                # 메인 애플리케이션 스타일
└── main.jsx                # 애플리케이션 진입점
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+ 
- npm 또는 pnpm

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   # 또는
   pnpm install
   ```

2. **환경 변수 설정**
   `.env` 파일을 생성하고 다음 변수들을 설정하세요:
   ```env
   GITHUB_ACCESS_TOKEN=your_github_token_here
   YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   # 또는
   pnpm dev
   ```

4. **브라우저에서 확인**
   - 자동으로 Chrome이 열리거나
   - 수동으로 `http://localhost:5173` 접속

### Windows 사용자를 위한 빠른 실행
```bash
run.bat
```

## 🔧 사용법

### 메인 대시보드 (`/`)
- 좌측: YouTube 재생목록
- 중앙: GitHub 레포지토리 탐색기
- 우측: Tistory 블로그 RSS 피드

### 개별 페이지
- `/github` - GitHub 관련 기능만 표시
- `/blog` - Tistory 블로그만 표시  
- `/youtube` - YouTube 재생목록만 표시

## 🔌 API 연동

### GitHub API
- GitHub Personal Access Token 필요
- 레포지토리 콘텐츠, 검색, 사용자 정보 등 제공

### YouTube Data API v3
- YouTube API 키 필요
- 재생목록, 영상 정보, 통계 등 제공

### Tistory RSS
- CORS 우회를 위해 AllOrigins 프록시 서비스 사용
- RSS 피드 파싱 및 표시

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
npm run build
# 또는
pnpm build
```

### 빌드 미리보기
```bash
npm run preview
# 또는
pnpm preview
```

## 🧪 개발 도구

### 코드 품질
```bash
npm run lint
# 또는
pnpm lint
```

### 개발 서버
- Vite의 Hot Module Replacement 지원
- 실시간 코드 변경 반영
- 빠른 개발 서버 시작

## 🔒 보안 고려사항

- API 키는 환경 변수로 관리
- 클라이언트 사이드에서 민감한 정보 노출 방지
- CORS 정책 준수

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](../LICENSE) 파일을 참조하세요.

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

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.
