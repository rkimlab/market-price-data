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

---

## 2. 시장별 서비스 사례 연동 (2026-11-15 추가, 그대로 붙여 넣기)

「장보기 연구지도」의 시장 상세 화면에 "이 시장에서 해 본 서비스" 칸을 추가해 주세요. 데이터는 아래 공개 주소에서 fetch로 읽어 오세요.

- https://raw.githubusercontent.com/rkimlab/market-price-data/main/data/market_services.json

규칙
1. `markets[]` 의 각 항목을 지도에 이미 있는 시장과 이름으로 연결하세요. 공백, '전통', 괄호 안 내용을 지우고 비교하고, `sido` 가 같은지도 확인하세요. 연결되지 않은 시장은 지도에 새 핀을 만들지 말고 "사례 데이터만 있음" 목록에 모아 두세요.
2. 각 `services[]` 는 program(서비스명), service_type, hours_cutoff(있을 때만), latest_source_year, sources[0].url(출처 링크)을 카드로 보여 주세요.
3. latest_source_year 가 비어 있거나 2024 이하이면 회색 처리하고 "○○년 자료 기준 · 현재 운영 여부 미확인" 이라고 표시하세요.
4. 필터: service_type(배송센터·공동배송 / 온라인몰·앱 입점 / 배달앱 입점 / 장보기 대행·도우미 / 픽업·보관함 / 야시장·행사 / 택배 접수 지원 / 콜센터 주문 / 마감할인·떨이 / 기타)와 "2025년 이후 자료만" 토글을 두세요.
5. 연구팀 제안(픽장: 16시 주문·퇴근길 거점 픽업, 덤장: 마감 전 덤·떨이, 불장: 금·토 축제 연계)은 사례 카드와 섞지 말고 "연구팀 제안" 라벨이 붙은 별도 층으로만 표시하세요.
6. 데이터에 없는 운영시간, 가격, 재고, 결제 가능 여부, 현재 운영 중이라는 표현은 만들지 마세요.
