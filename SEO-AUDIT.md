# SEO·GEO·AEO 점검 및 개선

점검일: 2026-10-07. 대상: https://content-payment-guide.pages.dev/

적용 스킬: seo-audit, ai-seo, site-architecture, content-strategy, schema. 스킬의 일반 제안보다 최신 공식 안내와 실제 화면을 우선했다.

## 확인된 문제와 구현

| 항목 | 이전 | 개선 |
| --- | --- | --- |
| 주제 허브 | 짧은 공통 안내와 카드 목록 | 네 허브에 독립적인 상황 설명, 확인 순서, 의미 있는 상세 글 링크 추가 |
| 제목 계층 | 허브 H1 다음 카드 H3 | 확인 순서와 상세 글 목록에 H2 추가 |
| 핵심 가이드 Article | headline이 실제 H1과 다름 | 화면 제목과 동일하게 수정, 빌드와 브라우저 점검에서 일치 여부 검사 |
| 페이지 구조화 데이터 | WebSite·BreadcrumbList·Article 중심 | WebPage, CollectionPage, AboutPage, ContactPage를 실제 페이지에 맞춰 추가. Article과 WebPage, WebSite를 @id로 연결 |
| 본문 연결과 근거 | 환불과 미승인 청구 글의 출처가 하단 중심 | 필요한 행동 바로 옆에 주문 내역·미승인 청구·환불 글 링크 및 공식 근거 링크 추가 |
| 재검증 | 기존 메타·링크·모바일 검사 | 전체 사이트맵 URL의 렌더링된 JSON-LD, HTTP 응답, canonical, noindex, 제목 계층, 고립 페이지와 탐색 깊이를 확인하는 seo-audit.mjs 추가 |

## 검색 의도와 사이트 구조

정보이용료현금화·콘텐츠이용료현금화·컨텐츠이용료현금화는 철자와 유사 의도를 통합했다. 구글현금화는 Google Play의 잔액·주문·구독 확인으로 분기한다. 중복 글을 추가하지 않고 기존 상세 글 10개와 핵심 가이드, 주제 허브 4개를 보강했다.

| 허브 | 상세 글 | 독립적인 질문 |
| --- | --- | --- |
| 구조와 비용 | cashout-meaning | 결제·외부 거래·환불은 어떻게 다른가? |
| 구조와 비용 | cashout-costs | 청구액과 최종 수령액을 어떻게 비교하는가? |
| 구조와 비용 | carrier-payment | 휴대전화 결제 조건과 제한은 어디서 확인하는가? |
| Google Play | play-balance | 잔액의 사용 범위와 반환 제한은 무엇인가? |
| Google Play | purchase-history | 주문과 청구를 어떻게 대조하는가? |
| Google Play | subscription-cancel | 다음 정기 결제를 어떻게 중단하는가? |
| 환불과 문제 해결 | refund-request | 환불 신청과 처리 상태는 어떻게 확인하는가? |
| 환불과 문제 해결 | item-support | 미제공 상품은 누구에게 어떤 자료로 문의하는가? |
| 결제 보호 | unknown-charges | 모르는 청구는 어떤 신고 경로를 사용하는가? |
| 결제 보호 | account-protection | 계정 접근과 구매 인증을 어떻게 보호하는가? |

홈 → 핵심 가이드·주제별 보기·전체 글 → 허브·상세 글. 상세 글에서 핵심 가이드와 허브로 돌아가는 링크 및 관련 글 링크가 있다. 전체 탐색 링크 기준 고립 페이지가 없고 색인 대상 21개 페이지 모두 홈페이지에서 최대 두 단계다.

## 검증 결과

- npm run validate: Astro 오류·경고·힌트 0개, 콘텐츠 10개 검증 통과.
- npm run build: HTML 23개, 내부 링크·앵커 546개, 제목·설명 중복 없음, canonical·JSON-LD·날짜 점검 통과.
- 사이트맵 색인 대상 21개, RSS 상세 글 10개. 검색 결과와 404는 사이트맵에서 제외.
- 초안·미래 발행 테스트 글은 페이지·검색·사이트맵·RSS 모두에서 제외.
- Playwright: 390px와 1440px의 44개 경로·화면 조합 통과. 가로 넘침, 상담 링크·복사, 검색, FAQ, 200% 글자 확대, JavaScript 비활성화, 404 확인.
- seo-audit.mjs: 정적 HTML이 브라우저에서 렌더링된 결과로 페이지별 메타와 구조화 데이터를 검사한다. 운영 배포 후 동일 검사로 21개 URL 모두 통과했다. 운영 주소의 44개 화면 점검도 통과했고, 배포 미리보기 주소의 X-Robots-Tag: noindex, follow를 확인했다.

재실행: `npm run validate`, `npm run build`, `npm run qa`. 브라우저 검사 주소는 환경 변수 QA_URL로 지정한다. 운영 SEO 검사: `node scripts/seo-audit.mjs`.

## 색인과 AI 검색에 관한 판단

운영 페이지는 정상 HTTP 응답, 자기 URL canonical, index/follow, 크롤링 허용 robots.txt, 정적 본문과 일반 a 링크를 제공한다. 내부 검색과 미리보기 도메인은 noindex로 분리한다. 이것은 기술적 색인 가능 조건에 대한 확인이며 실제 Google·네이버 색인 완료를 의미하지 않는다.

Google Search Console 및 네이버 서치어드바이저의 소유 확인·URL 검사·수집 보고서에 접근하지 않았으므로 등록, 색인 완료, 검색 유입 또는 AI 인용 실적을 완료로 보고하지 않는다. 공개 웹 검색에서 결과가 없다는 이유만으로 미색인을 확정하지 않는다.

FAQ는 독자가 읽는 화면에 유지하고 FAQPage는 추가하지 않았다. Google의 2026년 공식 변경 기록에서 FAQ 검색 기능 폐기 및 문서 제거를 확인했다. AI 검색을 위한 별도 형식이나 llms.txt는 추가하지 않았다. Google 최신 안내는 기본 SEO, 크롤링 가능한 텍스트와 유용한 콘텐츠를 강조하며 llms.txt를 사용하지 않는다고 설명한다. 다른 AI 검색의 인용도 보장할 수 없다.

운영자 신원, 전문 자격, 후기, 사업자 등록 및 누티켓과의 관계는 확인되지 않았다. 이를 구조화 데이터나 화면에서 만들어내지 않았다. 운영자 자체 정정 접수 채널은 제공되지 않아 기존 안내에 한계를 공개하고 있다. 향후 실제 운영자 정보와 접수 채널이 확보되면 공개 내용부터 보강해야 한다. 현재 분석 추적은 없으며 실제 사용자 Core Web Vitals와 검색 성과는 측정하지 않았다.

## 직접 확인한 공식 근거

- [Google AI 검색 최적화 안내](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google Article 구조화 데이터](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google 검색 문서 변경 기록](https://developers.google.com/search/updates)
- [Google canonical 안내](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google 사이트맵과 실제 수정일](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [네이버 SEO 기본 안내](https://searchadvisor.naver.com/guide/seo-basic-intro)
- [네이버 사이트맵·RSS 제출](https://searchadvisor.naver.com/guide/request-feed)
- [Google Play 환불 요청](https://support.google.com/googleplay/answer/15574897?hl=ko)
- [Google Play 환불 정책](https://support.google.com/googleplay/answer/2479637?hl=ko)

연락처 기존 확인일은 2026-10-03으로 유지했다. 자료 확인일, 글 수정일, 이 점검일은 서로 다른 목적의 날짜이며 배포 시각만으로 갱신하지 않는다.
