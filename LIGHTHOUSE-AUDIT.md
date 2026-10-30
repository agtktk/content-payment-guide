# Lighthouse 점검과 개선

측정일: 2026-10-30. Lighthouse 13.6.0, 로컬 Headless Chromium에서 운영 URL을 navigation 방식으로 검사했다. 각 URL·장치 조합을 수정 전과 배포 후 한 번씩 측정했다.

대상: https://content-payment-guide.pages.dev/ 및 https://content-payment-guide.pages.dev/articles/cashout-meaning/

| 페이지·장치 | 성능 전→후 | 접근성 전→후 | 권장사항 후 | SEO 후 | LCP 후 | TBT 후 | CLS 후 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 홈페이지 · 모바일 | 100 → 100 | 96 → 100 | 100 | 100 | 0.97초 | 0ms | 0 |
| 홈페이지 · 데스크톱 | 100 → 100 | 96 → 100 | 100 | 100 | 0.28초 | 0ms | 0 |
| 대표 게시글 · 모바일 | 100 → 100 | 100 → 100 | 100 | 100 | 0.93초 | 0ms | 0 |
| 대표 게시글 · 데스크톱 | 100 → 100 | 100 → 100 | 100 | 100 | 0.28초 | 0ms | 0 |

## 확인한 문제와 수정

홈페이지에서 진행 순서 번호 3곳과 주제 카드 번호 4곳의 대비가 부족했다. Lighthouse가 측정한 기존 대비는 각각 4:1과 3.6:1이었다. 두 선택자(.note-step span, .route-card .num)의 색상을 공통 --muted(#52665e)로 변경했다. 재측정에서 색상 대비 실패 노드는 7개에서 0개로 줄었다. 게시글은 수정 전부터 접근성 100점이었다.

HTML·문서 구조를 바꾸지 않았고 콘텐츠 발행일·자료 확인일과 인증 메타 태그는 유지했다. 성능은 기존 100점을 유지했다. 약 3.8KB 전송량의 공통 CSS에 관한 trace의 추정 절감은 0ms로, 추가 네트워크 분리나 비동기 CSS 변경을 적용할 근거는 없었다. 네트워크 종속성 등의 진단 안내가 모두 사라졌다는 의미는 아니다.

## 측정 조건과 한계

모바일은 Lighthouse 기본 모바일 프로필(412×823, 시뮬레이션 네트워크·CPU 4배 감속), 데스크톱은 --preset=desktop이다. 동일한 Lighthouse 버전·Chrome 실행 파일·URL·프로필로 전후를 비교했다. 보고서에 실제 configSettings를 저장하고 전후 일치를 검사했다. 브라우저는 확장 프로그램 없이 별도 프로필로 실행했다.

실험실 측정값이며 실제 사용자 Core Web Vitals를 대신하지 않는다. INP 실사용자 데이터는 측정하지 않았고, TBT를 INP라고 표시하지 않았다. 네트워크와 실행 환경에 따라 점수·시간이 달라질 수 있으므로 작은 LCP 차이를 속도 개선 성과로 해석하지 않는다. 접근성 100점도 모든 수동 접근성 검사 통과를 보증하지 않는다.

## 검증과 재실행

Astro 오류·경고·힌트 0개. npm run validate, npm run build, 브라우저 QA 58개 경로·화면 조합 및 렌더링 SEO 점검을 통과했다. 변경 사항을 GitHub에 반영하고 Cloudflare Pages 운영 사이트에 배포했다.

재실행: npm run audit:lighthouse -- after. JSON·HTML 원본과 comparison.json은 로컬 artifacts/lighthouse-2026-10-30 아래에 생성된다. Chrome 실행 파일은 CHROME_PATH 또는 설치된 Playwright Chromium을 사용한다. 보고서 생성: node scripts/lighthouse-report.mjs.

[Chrome 공식 Lighthouse 점수 설명](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)을 참고했다.
