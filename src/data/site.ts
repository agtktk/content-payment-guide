export const site = {
  name: '정보이용료현금화 컨텐츠이용료현금화 콘텐츠이용료현금화 정보실',
  description: '정보이용료현금화와 콘텐츠이용료현금화를 검색할 때 확인할 비용·결제 구조·위험, Google Play 환불과 계정 보호 안내.',
  editor: '정보실 편집',
  updatedAt: '2026-10-08',
  contact: {
    name: '누티켓', phone: '010-8111-1555', kakaoId: 'N1348',
    kakaoUrl: 'https://qr.kakao.com/talk/MBsKvshDmtamG2EuQNKdmPuGFJQ-',
    sourceUrl: 'https://xn--od1b246c0uc.kr', verifiedAt: '2026-10-03'
  }
} as const;
export const topics = [
  {id:'basics', name:'구조와 비용', number:'01', description:'결제, 환불, 거래 비용을 구분합니다.'},
  {id:'google-play', name:'Google Play', number:'02', description:'잔액과 구매 내역, 정기 결제를 확인합니다.'},
  {id:'troubleshooting', name:'환불과 문제 해결', number:'03', description:'환불 신청부터 미제공 상품 문의까지.'},
  {id:'safety', name:'결제 보호', number:'04', description:'알 수 없는 청구와 계정 노출에 대응합니다.'}
] as const;
export const phoneHref = 'tel:' + site.contact.phone.replaceAll('-', '');
export const informationFeeArticleIds = ['cashout-meaning','charge-categories','cashout-costs','counterparty-check','carrier-payment','billing-calendar','advance-fee','unknown-charges','purchase-versus-settlement','consultation-preparation'] as const;
