import requests
import json
import os
from typing import List, Dict, Optional
from urllib.parse import urljoin
from dotenv import load_dotenv

load_dotenv()

class GitHubService:
    """GitHub API를 사용하여 레포지토리 정보를 가져오는 서비스"""
    
    def __init__(self, api_token: Optional[str] = None):
        """
        GitHub 서비스 초기화
        
        Args:
            api_token: GitHub API 토큰 (선택사항, 없으면 공개 레포지토리만 접근 가능)
        """
        self.base_url = "https://api.github.com"
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "PyNote-App"
        }
        
        # 환경 변수에서 토큰을 가져오거나 전달받은 토큰 사용
        token = api_token or os.getenv('GITHUB_ACCESS_TOKEN') or os.getenv('GITHUB_TOKEN')
        if token:
            self.headers["Authorization"] = f"token {token}"
    
    def get_repository_files(self, owner: str, repo: str, path: str = "") -> List[Dict]:
        """
        GitHub 레포지토리에서 파일 목록을 가져옵니다.
        
        Args:
            owner: 레포지토리 소유자 (사용자명 또는 조직명)
            repo: 레포지토리 이름
            path: 조회할 경로 (기본값: 루트 디렉토리)
            
        Returns:
            파일 목록 (각 파일은 type, name, path, size 등의 정보 포함)
            
        Raises:
            requests.RequestException: API 요청 실패 시
        """
        url = f"{self.base_url}/repos/{owner}/{repo}/contents/{path}"
        
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            
            files = response.json()
            
            # 단일 파일인 경우 리스트로 변환
            if isinstance(files, dict):
                files = [files]
            
            return files
            
        except requests.RequestException as e:
            raise Exception(f"GitHub API 요청 실패: {e}")
    
    def get_file_content(self, owner: str, repo: str, path: str) -> str:
        """
        GitHub 레포지토리에서 특정 파일의 내용을 가져옵니다.
        
        Args:
            owner: 레포지토리 소유자
            repo: 레포지토리 이름
            path: 파일 경로
            
        Returns:
            파일 내용 (base64 디코딩된 문자열)
            
        Raises:
            requests.RequestException: API 요청 실패 시
        """
        url = f"{self.base_url}/repos/{owner}/{repo}/contents/{path}"
        
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            
            file_info = response.json()
            
            if file_info.get("type") != "file":
                raise Exception(f"지정된 경로는 파일이 아닙니다: {path}")
            
            import base64
            content = base64.b64decode(file_info["content"]).decode("utf-8")
            return content
            
        except requests.RequestException as e:
            raise Exception(f"GitHub API 요청 실패: {e}")
    
    def search_repositories(self, query: str, limit: int = 10) -> List[Dict]:
        """
        GitHub에서 레포지토리를 검색합니다.
        
        Args:
            query: 검색 쿼리
            limit: 결과 개수 제한
            
        Returns:
            검색된 레포지토리 목록
        """
        url = f"{self.base_url}/search/repositories"
        params = {
            "q": query,
            "per_page": min(limit, 100)  # GitHub API 최대 100개
        }
        
        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            
            result = response.json()
            return result.get("items", [])
            
        except requests.RequestException as e:
            raise Exception(f"GitHub API 요청 실패: {e}")
    
    def get_repository_info(self, owner: str, repo: str) -> Dict:
        """
        레포지토리 기본 정보를 가져옵니다.
        
        Args:
            owner: 레포지토리 소유자
            repo: 레포지토리 이름
            
        Returns:
            레포지토리 정보
        """
        url = f"{self.base_url}/repos/{owner}/{repo}"
        
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            
            return response.json()
            
        except requests.RequestException as e:
            raise Exception(f"GitHub API 요청 실패: {e}")


# 사용 예시 함수들
def get_files_from_public_repo(owner: str, repo: str, path: str = "") -> List[Dict]:
    """
    공개 레포지토리에서 파일 목록을 가져오는 편의 함수
    
    Args:
        owner: 레포지토리 소유자
        repo: 레포지토리 이름
        path: 조회할 경로
        
    Returns:
        파일 목록
    """
    github_service = GitHubService()  # 환경 변수에서 토큰을 자동으로 가져옴
    return github_service.get_repository_files(owner, repo, path)


def get_file_content_from_public_repo(owner: str, repo: str, path: str) -> str:
    """
    공개 레포지토리에서 파일 내용을 가져오는 편의 함수
    
    Args:
        owner: 레포지토리 소유자
        repo: 레포지토리 이름
        path: 파일 경로
        
    Returns:
        파일 내용
    """
    github_service = GitHubService()  # 환경 변수에서 토큰을 자동으로 가져옴
    return github_service.get_file_content(owner, repo, path)
