# OMILSOFT Official Site

오밀소프트 회사 소개와 한글·영문 타자연습 앱 **타닥타닥(TADAK)**의 공식 사이트입니다. GitHub Pages에서 HTML/CSS/JavaScript를 그대로 제공하며 빌드 단계나 프레임워크가 필요하지 않습니다.

- 회사 소개: `/`, `/en/`
- 타닥타닥 제품 소개·다운로드: `/tadak/`, `/en/tadak/`
- 사업자 및 운영자 정보: `/operator-info.html`, `/en/operator-info.html`
- 개인정보·약관·지원 문서: <https://eastlooo.github.io/tadak-legal/>

## 로컬 미리보기

저장소 루트에서 실행합니다.

```bash
python3 -m http.server 8080
```

<http://localhost:8080/tadak/>와 <http://localhost:8080/en/tadak/>에서 제품 랜딩을 확인할 수 있습니다. 기기 폭 375px, 768px, 1440px와 시스템 라이트·다크 모드를 확인해주세요.

## 확인 명령

외부 패키지 설치 없이 실행할 수 있습니다.

```bash
python3 tests/site-check.py
node --test tests/typing-demo.test.cjs
git diff --check
```

정적 검사는 페이지별 메타데이터·언어 연결·FAQ와 JSON-LD 일치·이미지 속성·내부 링크·정책 링크·사이트맵을 확인합니다. 타자 체험 검사는 한글 IME·수정·재시작·시간 측정·영어 문장을 확인합니다.

## 공통 디자인

`assets/brand.css`는 법률 사이트와 공유하는 Paper 색상·글꼴·간격·다크 모드 토큰입니다. 작업 폴더의 `../shared/brand.css`와 동일하며 다른 사이트에 그대로 복사할 수 있습니다. 저장소별로 독립 배포되므로 상대 저장소의 CSS를 직접 참조하지 않습니다.

실제 앱 화면과 최신 아이콘은 `assets/app/`, 한영 OG 이미지는 `assets/`에 있습니다. 이미지에는 WebP와 PNG 폴백을 제공합니다. `assets/fonts/`의 Pretendard 기반 웹폰트는 사이트 문구에 필요한 글자만 포함합니다. 새 문구를 추가하면 해당 글자의 폰트 포함 여부를 확인하고 필요시 서브셋을 다시 생성하세요. 폰트 출처와 라이선스는 같은 폴더의 `README.txt`, `OFL.txt`에 있습니다.

## 배포

GitHub Pages에서 현재 배포 브랜치의 `/ (root)`를 사용합니다. 공식 주소는 <https://eastlooo.github.io/omilsoft-official-site/>입니다. 페이지 추가·변경 시 `sitemap.xml`의 URL·lastmod·언어 대응 링크도 함께 갱신해주세요. 기존 Search Console 인증 태그와 Google Analytics 측정 ID를 유지합니다.

2026-10-21 개편 내용과 검증 한계는 [REDESIGN_REPORT.md](REDESIGN_REPORT.md)를 참고하세요.
