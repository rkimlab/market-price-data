# 전통시장 가격 투명성 데이터 (연구용)

하이테크마케팅 연구용 공공 가격 통계 정리본입니다. 매일 오전 10시(KST) 갱신, 2026-12-19까지 운영.

- `data/price_transparency_panel.json` — 연구지도 '가격 참고' 탭용 요약 (축산 업태별 + 수산 전통시장·대형유통)
- `data/status.json` — 마지막 성공·시도 시각, 데이터셋별 stale 여부
- `data/livestock_daily_history.csv`, `data/fish_daily_history.csv` — 일별 누적 원자료
- `data/archive/price_panel_YYYY-MM-DD.json` — 날짜별 고정본(보고서 인용용)

출처: 축산물품질평가원 축산유통정보(다봄) 업태별가격정보, 한국농수산식품유통공사 KAMIS Open API.
개별 점포의 가격·재고·결제 가능 여부를 뜻하지 않습니다. 축평원 '정육점'은 전통시장 내 정육점을 포함하지만 전통시장 가격이 아닙니다.
수집 실패 시 직전 값을 보존하고 `stale: true`로 표시합니다.
