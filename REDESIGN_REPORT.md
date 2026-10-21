# 오밀소프트 공식 사이트 개편 보고서

작업일: 2026-10-21. 정적 HTML/CSS/JavaScript와 기존 브랜치를 유지했습니다. 새 프레임워크나 빌드 단계는 추가하지 않았습니다.

## 페이지별 변경

| URL | 변경 내용 |
| --- | --- |
| `/` | 회사 소개를 짧은 스튜디오 소개, 실제 타닥 홈 화면, 제품 소개·무료 다운로드 연결, 운영자 정보와 문의로 정리했습니다. |
| `/en/` | 같은 구성의 영어 회사 홈페이지를 제공하고 모든 제품 연결을 새 `/en/tadak/`로 맞췄습니다. |
| `/tadak/` | 검색과 다운로드 전환의 중심 페이지로 확장했습니다. 실제 홈 화면과 네 마스코트, 스토어 버튼, 4.6점·2,057개 평가·무료·지원 기기 정보, 연습 모드, 기록과 약점 분석, 친구 도전, iPad·외부 키보드, 웹 체험, FAQ 8개, 마지막 다운로드 CTA를 제공합니다. |
| `/en/tadak/` | 영어 전용 랜딩을 새로 추가했습니다. 영어 스토어 화면과 영어 타자 체험을 사용하며 한국어 랜딩과 상호 전환됩니다. |
| `/operator-info.html` | 공통 헤더·푸터와 Paper 디자인, breadcrumb와 구조화 데이터, 메타데이터를 적용했습니다. 사업자 정보와 기존 안내 원문을 보존했습니다. |
| `/en/operator-info.html` | 영어 운영자 정보도 같은 체계로 적용하고 기존 사업자·연락처 정보를 보존했습니다. |

제품 랜딩의 실제 화면은 짧은 글·고전 필사, 메신저 실전, 모두의 공간, 나의 기록, 친구 승부, iPad 연습을 보여줍니다. 자리·단어 연습과 나머지 실전 모드는 제공된 사실을 바탕으로 설명했습니다. 제공된 참고 이미지에 없는 모드 화면은 새로 그리거나 실제 화면처럼 만들어 넣지 않았습니다.

## 디자인 통일

- 법률 사이트 작업자가 먼저 만든 `../shared/brand.css`를 채택했습니다. `assets/brand.css`와 바이트 단위로 같습니다.
- 따뜻한 Paper 배경, 먹색 본문, 코발트 강조색, Pretendard, 선으로 구분한 평면 구성을 사용했습니다.
- 제품 헤더와 푸터는 새 앱 아이콘과 TADAK 워드마크를 사용하며, 회사 홈은 OMILSOFT 워드마크로 구분합니다.
- 마스코트는 제공된 실제 앱 화면에서 네 친구를 추출했습니다. 가짜 키캡 글자 장식이나 무거운 그림자·그라디언트는 사용하지 않았습니다.
- 시스템 다크 모드, 키보드 포커스, 본문 건너뛰기, 최소 높이 44px의 주요 링크·버튼, 모션 감소 설정을 지원합니다.
- 700px 이하에서 제품 본문을 한 열로 전환하고 연습 화면과 설명을 함께 읽을 수 있게 배치했습니다. 헤더의 다운로드·언어 전환은 모바일에서도 제공합니다.

## SEO 체크리스트

| 항목 | 상태 |
| --- | --- |
| 페이지마다 고유 title 60자 이하·description 155자 이하 | 정적 검사 통과 |
| 한글 타자연습·영타 연습·아이패드·키보드·타자 속도 측정 관련 문구 | 제목·설명·본문·FAQ에 자연스럽게 반영 |
| 영어 typing practice app·Korean typing practice | 영어 제목·설명·본문·FAQ에 반영 |
| canonical 및 ko/en/x-default hreflang | 6개 페이지 상호 대응 검사 통과 |
| HTML lang, 한 페이지당 h1·main 각 하나, 고유 id | 검사 통과 |
| Open Graph·Twitter 큰 이미지, og:url·언어 | 모든 페이지 반영 |
| 새 favicon 32/64px·apple-touch-icon 180px | 모든 페이지 반영 |
| Organization·WebSite JSON-LD | 모든 페이지 반영 |
| MobileApplication·무료 Offer·평점 JSON-LD | 한영 제품 랜딩 반영, 평점·평가 수 화면에도 표시 |
| FAQPage JSON-LD | 한영 각 8문항, 실제 화면의 질문·답변과 정확히 일치함을 검사 |
| BreadcrumbList | 한영 운영자 정보 반영 |
| sitemap.xml·lastmod·hreflang alternate | 6개 canonical URL, 2026-10-21 기준 검사 통과 |
| robots.txt의 sitemap 참조 | 기존 정상 설정 유지·검사 통과 |
| Search Console 인증 | 한국어 홈의 기존 인증 태그 두 개 유지, 영어 홈에도 동일 반영 |
| 기존 Google Analytics | `G-R1BCDWKTDV` 유지 |
| 개인정보·약관·지원·계정 삭제·커뮤니티 정책 | 모든 푸터에서 법률 사이트의 대응 언어 문서로 연결 |
| 이미지 alt·실제 width/height, WebP·PNG 폴백 | 검사 통과, 본문 화면은 lazy loading |
| 히어로 이미지 우선 로딩·로컬 폰트 서브셋 | 적용 |
| Lighthouse SEO/Best Practices/Accessibility ≥95, Performance ≥90 | 환경 제약으로 미측정, 달성 수치로 주장하지 않음 |

현재 제공된 App Store 평점과 평가 수는 작업 지시의 검증된 값입니다. 이후 값이 바뀌면 한영 화면의 proof strip과 MobileApplication JSON-LD를 함께 갱신해야 합니다. FAQPage는 구조화 데이터 제공이며 검색 결과의 리치 결과 노출을 보장하지 않습니다.

## 생성 자산

- `assets/app/`: 새 32/64px favicon, 180px Apple 아이콘, 256px 앱 아이콘의 PNG/WebP.
- `assets/app/{ko,en}-{practice,messenger,community,records,challenge}.png/.webp`: `../refs/`의 실제 iPhone 스토어 화면을 폭 600px로 최적화했습니다.
- `assets/app/{ko,en}-ipad.png/.webp`: 실제 iPad 스토어 화면, 폭 1000px.
- `assets/app/{ko,en}-hero.png/.webp`: 실제 홈 화면을 크롭하고 폭 640px로 최적화했습니다.
- `assets/app/mascots.png/.webp`: 기존 실제 앱 화면에서 추출한 네 마스코트. 연결된 중립 배경만 투명 처리했습니다.
- `assets/tadak-og-ko.png`, `assets/tadak-og-en.png`: 제공된 한영 헤더 이미지 기반의 1200×630 제품 공유 이미지.
- `assets/omilsoft-og-ko.png`, `assets/omilsoft-og-en.png`: 새 앱 아이콘과 같은 실제 헤더 화면을 사용한 1200×630 회사 공유 이미지.
- `assets/fonts/pretendard-regular.woff2`, `pretendard-bold.woff2`: 문구에 필요한 글자만 남긴 약 42KB씩의 로컬 서브셋. 원본 라이선스의 예약 이름을 피하도록 폰트 내부 이름은 `TadakPaperSans`로 지정했습니다. 저작권·라이선스 메타데이터를 유지하고 `OFL.txt`를 동봉했습니다.
- `assets/site.js`: 공통 저작권 연도 갱신. 타자 체험 외에는 별도 상호작용 라이브러리가 필요하지 않습니다.

기존 이미지 파일과 공개 URL은 제거하지 않았습니다. 새 자산은 각 저장소 안에서 독립 제공되므로 `../refs/`가 배포 서버에 없어도 됩니다.

## 검증 결과

실행 완료:

```bash
python3 tests/site-check.py
node --test tests/typing-demo.test.cjs
git diff --check
```

- 6개 정적 페이지의 title·description 길이와 중복, canonical·hreflang 역방향 연결, JSON-LD 파싱, FAQ 원문 일치, 정책 링크, 이미지 속성, 상대 경로·본문 앵커, 사이트맵을 검사했습니다.
- 기존 5개 타자 체험 테스트와 새 영어 문장 테스트, 총 6개가 통과했습니다. 한글 조합 중 완료 방지, 모바일 방식 삭제, 붙여넣기·오타, 백그라운드 시간 제외, 초기화, 영어 안내를 포함합니다.
- 기존 HEAD의 한영 운영자 페이지와 현재 페이지의 모든 section 원문을 공백 정규화 후 비교하여 동일함을 확인했습니다. 사업자등록번호·주소·대표자·이메일·전화번호를 바꾸지 않았습니다. 법률 문구 오탈자 수정도 없습니다.
- 공유 토큰과 로컬 복사본이 동일하며, 4개 새 OG 이미지가 모두 1200×630인 것을 확인했습니다.
- 공통 본문/보조문구/링크 색의 Paper 배경 대비는 라이트 모드 약 14.72/5.73/6.05, 다크 모드 약 14.78/8.12/9.32로 WCAG AA 본문 기준 4.5 이상입니다. 이는 토큰 색 계산이며 전체 페이지의 자동 접근성 점수를 대신하지 않습니다.

미확인:

- 브라우저 도구는 샌드박스에서 localhost 포트를 열 수 없어 실행에 실패했습니다. Chrome 미리보기도 브라우저 보안 정책상 `file:` URL이 거부되었습니다. 정책을 우회하지 않았고, 실제 렌더링 스크린샷이나 Lighthouse 점수를 확보했다고 주장하지 않습니다.
- 정상 로컬 환경 또는 배포 후 375px·768px·1440px, 한영·라이트/다크 모드, 가로 스크롤·텍스트 잘림, VoiceOver, 실제 iPad/Safari 입력을 추가로 확인해주세요.
- 배포 후 스토어 링크·법률 사이트의 영문 문서, Google Search Console URL 검사와 구조화 데이터 검사, 실제 App Store 평점 갱신 여부를 확인하면 됩니다.
- 스토어 버튼은 플랫폼 아이콘을 포함한 공식 스타일의 HTML 버튼입니다. 배포 시 최종 앱 마케팅 배지 가이드와의 일치 여부도 확인할 수 있습니다.

## 로컬 미리보기

저장소 루트에서 다음 명령으로 실행합니다.

```bash
python3 -m http.server 8080
```

- 한국어 제품: <http://localhost:8080/tadak/>
- 영어 제품: <http://localhost:8080/en/tadak/>
- 회사 홈: <http://localhost:8080/>, <http://localhost:8080/en/>
- 사업자 정보: <http://localhost:8080/operator-info.html>, <http://localhost:8080/en/operator-info.html>

이 명령은 사용자의 일반 로컬 터미널에서 실행할 수 있습니다. 이번 도구 샌드박스에서는 포트 바인딩이 제한되어 있습니다.

## 커밋 및 공유 결과

최근 커밋 이력과 공동 작성자 표기 방식을 확인했습니다. 요청된 Conventional Commit 형식의 한국어 메시지를 준비했으나, `git add` 단계에서 실제 저장소의 `.git/worktrees/omilsoft/index.lock` 쓰기가 `Operation not permitted`로 차단되었습니다. 권한 변경이나 우회는 시도하지 않았습니다.

- 변경 사항은 현재 브랜치의 작업 트리에 남아 있습니다.
- 커밋 메시지: `/tmp/omilsoft-official-site-commit.txt`.
- 공동 작성자 끝줄: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- 커밋 및 푸시는 생성하지 않았습니다.
- `../shared/brand.css`는 먼저 작성된 공통 파일을 그대로 채택했고 `assets/brand.css`와 동일합니다.
- `../shared/omilsoft-coordination.md`에 공통 토큰·영어 제품 URL을 전달했으며 법률 작업자가 `/en/tadak/` 반영을 확인했습니다.
