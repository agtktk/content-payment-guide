# 콘텐츠결제 길잡이

정보이용료현금화·콘텐츠이용료현금화·구글현금화 검색 의도를 실제 결제·환불·보호 질문으로 정리한 정적 Astro 사이트입니다. 기존 참고 사이트의 프로젝트를 수정하지 않는 별도 저장소와 Cloudflare Pages 프로젝트를 사용합니다.

- 사이트: https://content-payment-guide.pages.dev/
- 저장소: https://github.com/agtktk/content-payment-guide
- 사이트맵: https://content-payment-guide.pages.dev/sitemap.xml
- RSS: https://content-payment-guide.pages.dev/rss.xml

## 개발 및 검증

Node 24와 npm을 사용합니다.

```sh
npm ci
npm run validate
npm run build
npm run preview
# 실제 출력된 미리보기 포트가 다르면 QA_URL 지정
npm run qa
```

`validate`는 Astro 타입 진단, 글의 날짜·출처·관련 글·중복 제목과 한국 표준시 발행 경계를 확인합니다. `build`는 정적 출력의 링크·앵커·H1·메타데이터·canonical·구조화 데이터·RSS·사이트맵을 검사합니다. `qa`는 Chromium 설치 후 실행하며 390px/1440px, 검색, 복사, FAQ, 200% 글자 확대와 JavaScript 없는 읽기를 검사합니다. QA 결과는 무시된 `artifacts/`에 저장됩니다.

## 콘텐츠 시스템

- `src/content/articles/*.md`: 공개 상세 글 10개. MDX 파일도 컬렉션에서 지원합니다.
- `src/content.config.ts`: 프런트매터 스키마.
- `src/lib/publication.ts`: draft와 미래 발행 제외. 발행은 날짜의 한국 표준시 자정 기준입니다.
- `src/lib/content.ts`: 공개 글만 제공하는 공통 함수. 상세 경로·허브·목록·검색·RSS·사이트맵이 모두 참조합니다.
- `src/data/site.ts`: 사이트 편집 표시와 **모든 상담 연락처의 유일한 설정**.

본문의 Markdown에는 H1을 넣지 않습니다. 제목·편집 주체·발행/수정일·핵심 답변·범위·본문·FAQ·출처·관련 글·상담 순서는 상세 글 템플릿이 제공합니다. `checkedAt`은 공식 자료 확인일이고 `updatedAt`은 실제 내용 수정일입니다. 재배포만으로 날짜를 변경하지 않습니다. 정적 소개·정책 페이지를 수정하면 `site.updatedAt`도 실제 수정일로 변경합니다.

새로운 글은 독립적인 검색 의도가 있을 때 추가합니다. `related`는 공개 글을 가리키도록 관리합니다. 표현만 다른 글은 기존 글에 통합합니다. 예약 발행은 해당 날짜 이후 빌드가 필요하며 자동 스케줄은 설정하지 않았습니다.

RSS에는 핵심 답변·범위·본문·질문·출처를 포함합니다. 현재 글은 Markdown이며, MDX에서 상호작용 컴포넌트를 사용하면 RSS에는 별도의 정적 설명을 제공해야 합니다.

## SEO와 미리보기

`SITE_URL` 기본값은 실제 production 주소입니다. 검색과 404는 `noindex`이고 사이트맵에 제외합니다. `SITE_PREVIEW=true` 또는 `CF_PAGES=1`에서 main 외 브랜치는 전체 noindex 메타와 헤더를 생성합니다. `_headers`에는 별칭 미리보기 도메인 noindex도 적용됩니다. production과 preview 빌드를 혼동하지 않도록 배포 전에 환경 변수를 확인합니다.

WebSite·BreadcrumbList·Article을 화면 내용과 일치시키고 FAQPage는 사용하지 않습니다. 2026-10-07 Google 공식 변경 안내에서 FAQ 검색 기능 종료를 확인했습니다. 네이버 RSS 안내에 맞추어 피드에 본문을 포함합니다. 검색 순위·수집·인용을 보장하지 않습니다.

## Cloudflare Pages 배포

```sh
npm run validate
npm run build
npx wrangler pages deploy dist --project-name content-payment-guide --branch main
```

새 프로젝트는 `wrangler pages project create content-payment-guide --production-branch main`으로 만듭니다. 이번 배포는 Direct Upload이며 GitHub 자동 배포 연결은 설정하지 않았습니다. GitHub Actions는 검증만 수행합니다. 브랜치가 main이 아닌 미리보기는 반드시 `SITE_PREVIEW=true`로 빌드하고 업로드하세요. 인증 토큰은 저장소에 포함하지 않습니다.

## 확인한 공식 자료 (2026-10-07)

- [Google 대한민국 결제 수단](https://support.google.com/googleplay/answer/2651410?hl=ko&co=GENIE.CountryCode%3DKR)
- [Play 잔액](https://support.google.com/googleplay/answer/3423011?hl=ko)
- [환불 정책](https://support.google.com/googleplay/answer/2479637?hl=ko)
- [환불 요청](https://support.google.com/googleplay/answer/15574897?hl=ko)
- [환불 상태](https://support.google.com/googleplay/answer/15576615?hl=ko)
- [구독 취소](https://support.google.com/googleplay/answer/7018481?hl=ko)
- [개발자 문의](https://support.google.com/googleplay/answer/113418?hl=ko)
- [알 수 없는 청구](https://support.google.com/googleplay/answer/2851610?hl=ko)
- [구매 인증](https://support.google.com/googleplay/answer/1626831?hl=ko)
- [결제 수단 관리](https://support.google.com/googleplay/answer/4646404?hl=ko)
- [Google 문서 업데이트](https://developers.google.com/search/updates)
- [Google 생성형 검색 안내](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [네이버 SEO 기본 안내](https://searchadvisor.naver.com/guide/seo-basic-intro)
- [네이버 RSS·사이트맵](https://searchadvisor.naver.com/guide/request-feed)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Cloudflare Astro 배포](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)

참고 사이트의 구조는 홈·핵심 가이드·허브·글·상담 탐색을 참고했습니다. 문구나 지역 글을 복제하지 않았습니다.

## 운영 시 필요한 별도 설정

사이트 운영자의 편집 문의와 개인정보 문의 전용 채널은 제공되지 않아, 현재 접수 불가 상태를 공개 페이지에 명시했습니다. 누티켓을 운영자나 정정 담당자로 추정하지 않습니다. 운영자의 법적 신원과 자격도 만들지 않습니다. 실제 문의 채널을 제공받으면 화면과 개인정보 안내를 함께 수정해야 합니다.

Google Search Console·네이버 서치어드바이저 소유 확인/피드 제출·검색 수집 상태는 이 구현 및 배포와 별도의 작업이며 완료를 주장하지 않습니다.
