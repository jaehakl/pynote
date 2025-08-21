# PyNote API

## GitHub API 설정

GitHub API 요청 제한을 해결하기 위해 Personal Access Token을 설정할 수 있습니다.

### 1. GitHub Personal Access Token 생성

1. GitHub에 로그인
2. Settings > Developer settings > Personal access tokens > Tokens (classic)
3. "Generate new token" 클릭
4. 토큰에 적절한 권한 부여 (public_repo 권한만으로도 충분)
5. 토큰 생성 후 복사

### 2. 환경 변수 설정

다음 중 하나의 방법으로 토큰을 설정하세요:

#### 방법 1: .env 파일 생성 (권장)
```bash
# apps/note/api/.env 파일 생성
echo "GITHUB_ACCESS_TOKEN=your_github_personal_access_token_here" > .env
```

#### 방법 2: 환경 변수 설정
```bash
export GITHUB_ACCESS_TOKEN=your_github_personal_access_token_here
```

#### 방법 3: 실행 시 환경 변수 전달
```bash
GITHUB_ACCESS_TOKEN=your_github_personal_access_token_here python -m uvicorn app.main:app --reload
```

### 3. .env 파일 예시
```bash
# apps/note/api/.env 파일 내용
GITHUB_ACCESS_TOKEN=ghp_your_actual_token_here
```

### 3. 토큰 없이 사용

토큰을 설정하지 않으면 공개 레포지토리만 접근 가능하며, API 요청 제한이 더 엄격합니다.

## API 엔드포인트

### GitHub 관련
- `GET /github/files/{owner}/{repo}` - 레포지토리 파일 목록
- `GET /github/content/{owner}/{repo}` - 파일 내용 조회
- `GET /github/search` - 레포지토리 검색
- `GET /github/repo/{owner}/{repo}` - 레포지토리 정보
