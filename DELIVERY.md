# 제작·검증·배포 기록

확인일: 2026-10-07 (한국 표준시)

## 결과

- 사이트명: 콘텐츠결제 길잡이
- 대표 주제: 정보이용료현금화. 콘텐츠/컨텐츠 철자 변형 통합, 구글현금화는 Play 잔액·환불·구매 문제로 구분.
- 상세 글 10개 + 핵심 가이드 1개 + 주제 허브 4개. HTML 페이지 총 23개(404 포함).
- 저장소: https://github.com/agtktk/content-payment-guide
- 운영 주소: https://content-payment-guide.pages.dev/
- 사이트맵: https://content-payment-guide.pages.dev/sitemap.xml
- RSS: https://content-payment-guide.pages.dev/rss.xml
- 배포 식별 주소: https://50809576.content-payment-guide.pages.dev/
- 기존 참고 사이트 저장소·Cloudflare 프로젝트는 수정하지 않음.

## 검증

- `npm run validate`: 성공. Astro 오류 0, 경고 0, 힌트 0. 스키마·공식 출처·날짜·관련 글·고정 연락처 검증 통과.
- `npm run build`: 성공. 정적 HTML 23개 및 내부 링크/앵커 533개, 단일 H1, 중복 없는 제목/설명, canonical, JSON-LD 검사 통과.
- 공개 RSS item 10개와 sitemap lastmod 검증 통과.
- 실제 초안·2099년 미래 발행 fixture를 넣어 경로·검색·RSS·사이트맵에서 제외됨을 확인하고 fixture 삭제.
- 전체 미리보기 noindex 빌드 검증 후 production 설정으로 재빌드.
- 390px·1440px의 공개 22개 경로, 총 44회 브라우저 검사 통과. 390px 가로 넘침 없음.
- 검색 철자 변형·결과 없음·안전한 문자열 처리·추천 검색, ID 복사, 정확한 전화/카카오톡 링크, FAQ, 200% 글자 확대, JavaScript 없는 읽기 검증 통과.
- 위 브라우저 검사를 실제 운영 배포 주소에서 다시 수행해 통과. 상세 결과와 화면은 로컬 `artifacts/`에 저장(저장소 업로드 제외).
- 운영 홈·사이트맵·RSS·검색·robots 응답 200 확인. 존재하지 않는 경로 응답 404와 안내 화면 확인.
- 내부 검색 X-Robots-Tag noindex 확인. 배포 식별 주소 X-Robots-Tag noindex 확인. 운영 홈은 index 메타.
- `npm audit`: 알려진 취약점 0.

## 운영 범위와 남은 작업

- Google Search Console·네이버 서치어드바이저 소유 확인/등록/피드 제출은 수행하지 않음. 수집·색인 상태와 순위를 확인하거나 보장하지 않음.
- 운영자의 편집·개인정보 문의 채널은 제공되지 않아 접수 불가 상태를 해당 페이지에 명시. 실제 채널 제공 후 연결 필요. 누티켓은 외부 상담 대상이며 운영자나 정정 담당자로 추정하지 않음.
- 연락처 기존 확인일 2026-10-03을 유지. 재확인했다고 표시하지 않음.
- GitHub 업로드와 Pages Direct Upload 배포를 완료. GitHub 자동 배포 연결은 구성하지 않음.
- 예약 글 발행은 해당 날짜 이후 재빌드가 필요. 자동 예약 작업은 생성하지 않음.
