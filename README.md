# OMILSOFT Official Site

Google Play 개발자 등록용 도메인 검증과 공식 회사 소개 페이지 용도의 정적 사이트입니다.

## 로컬 미리보기

```bash
cd omilsoft-official-site
python3 -m http.server 8080
# 브라우저에서 http://localhost:8080 접속
```

## GitHub Pages 배포

1. GitHub에서 새 저장소 생성 (예: `omilsoft-official`)
2. 이 폴더의 파일을 저장소 루트에 커밋/푸시
3. GitHub 저장소 설정 -> `Pages`
4. Source를 `Deploy from a branch`로 선택
5. Branch를 `main` / `/ (root)`로 선택 후 저장
6. 발급된 URL 확인 (`https://<username>.github.io/<repo>/`)

## 커스텀 도메인 연결(선택)

1. 도메인 DNS에 `CNAME` 또는 `A/AAAA` 레코드 설정
2. GitHub Pages `Custom domain`에 도메인 입력
3. DNS 전파 후 HTTPS 활성화

