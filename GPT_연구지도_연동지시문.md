# ChatGPT 연구지도 연동 지시문 (그대로 붙여 넣기)

「장보기 연구지도」에 '가격 참고' 탭을 추가해 주세요. 데이터는 파일 업로드가 아니라 아래 공개 주소에서 페이지가 열릴 때마다 fetch로 읽어 오게 해 주세요(CORS 허용됨).

- 요약: https://raw.githubusercontent.com/rkimlab/market-price-data/main/data/price_transparency_panel.json
- 상태: https://raw.githubusercontent.com/rkimlab/market-price-data/main/data/status.json
- (선택) 일별 누적: https://raw.githubusercontent.com/rkimlab/market-price-data/main/data/livestock_daily_history.csv , https://raw.githubusercontent.com/rkimlab/market-price-data/main/data/fish_daily_history.csv

규칙
1. 시장 상세 화면이 아니라 별도 탭으로 만드세요.
2. 축산 표: datasets[0].items 의 축종·부위·등급별 대형마트(mart)/슈퍼마켓(super)/정육점(butcher) mean31 과 super_vs_mart_pct, butcher_vs_mart_pct. 열 제목은 '정육점(전통시장 내 포함)'.
3. 수산 표: datasets[1].items 의 trad_mean/trad_median/trad_n, big_mean/big_median/big_n, trad_vs_big_pct_mean. flag 가 있으면 회색 처리하고 % 대신 '판정 보류'.
4. 각 표 위에 provider, period, updated_at, source_url, caveats 를 표시하세요. 데이터셋의 stale 가 true 이면 '갱신 지연 — 마지막 성공: status.json 의 last_success' 배너를 띄우세요.
5. fetch 실패 시 빈 화면 대신 "가격 데이터를 불러오지 못했습니다" 문구와 저장소 링크를 보여주세요.
6. '저렴/비쌈' 같은 평가 문구 없이 숫자와 비율만 보여주세요. 데이터에 없는 품목, 개별 점포 가격, 재고, 결제 가능 여부는 만들지 마세요.
7. 브라우저 캐시 때문에 하루 늦게 보일 수 있으니 URL 뒤에 ?v=오늘날짜 를 붙여 요청하세요.
