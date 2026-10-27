# 사이트맵 공통 점검

점검일: 2026-10-27.

Search Console의 ‘가져올 수 없음’과 사이트맵 URL의 실시간 테스트 통과는 구분해야 한다. 사용자 화면에서 실시간 테스트 통과는 확인했지만 사이트맵 보고서 처리 성공은 확인하지 못했다. HTTP 200 또는 Googlebot 사용자 에이전트 문자열을 사용한 요청만으로 실제 Google의 사이트맵 수집 성공을 증명할 수 없다.

## 확인한 배포 구성과 보완

Cloudflare API에서 아래 6개 프로젝트가 production/main으로 배포되어 있음을 확인했다. 계정의 Access 애플리케이션 목록은 비어 있었다. 운영 사이트맵 응답에서 noindex 또는 인증 화면은 관찰되지 않았다. 이는 모든 지역·시각·실제 Google IP에 대한 보장은 아니다.

기존에 content-payment-guide는 /sitemap.xml만 제공했고, 나머지 5개 프로젝트는 /sitemap-index.xml과 /sitemap-0.xml만 제공했다. 서로 다른 파일명을 같은 주소로 제출할 경우 404가 발생했다. 잘못된 주소가 실제 제출되었는지는 확인하지 못했으므로 모든 실패의 원인으로 단정하지 않는다.

모든 프로젝트가 /sitemap.xml과 /sitemap-index.xml 두 경로에서 유효한 XML을 반환하도록 빌드 후 처리를 보완했다. 원래 제출 주소, robots.txt, 하위 사이트맵, 콘텐츠 URL은 보존했다. 이 작업은 주소 호환성 보완이며 Google의 처리 실패가 해결됐다는 의미는 아니다.

| 프로젝트 | 두 경로 HTTP | 하위 지도 포함 URL 수 |
| --- | --- | --- |
| content-payment-guide | 200 | 28 |
| micropayment-information-hub | 200 | 64 |
| toss-postpay-guide | 200 | 23 |
| naver-postpay-guide | 200 | 23 |
| information-fee-guide | 200 | 23 |
| content-fee-guide | 200 | 22 |

6개 모두 검증·빌드 통과. 배포 후 XML의 네임스페이스·루트·하위 파일 응답·동일 출처·검색 및 404 제외·두 제출 경로의 최종 URL 집합 일치를 검사했다. 총 183개 URL 참조를 확인했다. robots.txt는 크롤링 허용 상태다. 기계 검사 결과는 artifacts/sitemap-fleet-2026-10-27.json에 보관한다.

별도 폴더의 기존 사용자 변경과 미커밋 콘텐츠는 보존했다. 다른 사이트의 소스 수정은 각 scripts/check-build.mjs에만 한정했다. 현재 사이트의 GitHub에는 이 프로젝트 변경만 동기화하며 다른 프로젝트의 미커밋 전체 내용을 함께 올리지 않는다.

## 아직 확인하지 못한 사항

실제 Googlebot 요청 기록과 Search Console 사이트맵 처리 응답에는 접근하지 못했다. 따라서 올바른 기존 주소에서도 발생한 가져오기 실패의 공통 원인은 미확정이다. 확인하지 않은 원인을 Cloudflare 차단, 도메인 제재, 콘텐츠 품질 또는 XML 오류로 단정하지 않는다. Google의 사이트맵 보고서 성공 표시를 확인하기 전에는 Google 인식 문제를 해결 완료로 보고하지 않는다.

공식 참고: [Google 사이트맵 가져오기 오류](https://support.google.com/webmasters/answer/7451001?hl=ko), [Cloudflare 미리보기 색인 제어](https://developers.cloudflare.com/pages/configuration/preview-deployments/).
