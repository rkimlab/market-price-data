// 사용: node build_deck.mjs <panel.json> <out.pptx> <상태라벨>
import fs from 'fs';
import * as S from '/home/user/.perplexity/skills/office/pptx/scripts/framework.mjs';
const [,, PANEL, OUT, STATUS] = process.argv;
const P = JSON.parse(fs.readFileSync(PANEL, 'utf8'));
const [L, F] = P.datasets;
const snap = P.generated_at.slice(0, 10);
const fmt = n => n == null ? '—' : Math.round(n).toLocaleString('ko-KR');
const pct = n => n == null ? '—' : `${n.toFixed(0)}%`;
S.setTheme({ fonts: { sans: 'Noto Sans CJK KR', mono: 'Noto Sans Mono CJK KR' } });
const deck = S.newDeck();
const KAMIS = { name: 'KAMIS 소매가격 Open API', url: 'https://www.kamis.or.kr/customer/reference/openapi_list.do?action=detail&boardno=17' };
const EKAPE = { name: '축산물품질평가원 업태별가격정보', url: 'https://www.ekapepia.com/v3/hereMeat/businessTypePriceInfo.do' };
const REPO = { name: `고정본 price_panel_${snap}.json`, url: `https://github.com/rkimlab/market-price-data/blob/main/data/archive/price_panel_${snap}.json` };
const kick = `${STATUS} / ${snap} 수집본 · 조사기간 ${F.period}`;
const short = s => s.replace(/\(.*\)/, '');
const unitOf = s => (s.match(/,?([^,()]*\d[^,()]*|1마리|1손)\)$/) || [, ''])[1];

// 수산 분류: 평균·중앙값 모두 <100 → 낮음, 모두 ≥100 → 높음, 엇갈림 → 혼재, flag → 보류
const r100 = (x, y) => (x != null && y) ? x / y * 100 : null;
const fish = F.items.map(i0 => {
  const i = { ...i0, trad_vs_big_pct_mean: r100(i0.trad_mean, i0.big_mean), trad_vs_big_pct_median: r100(i0.trad_median, i0.big_median) };
  const a = i.trad_vs_big_pct_mean, b = i.trad_vs_big_pct_median;
  const cls = i.flag ? 'hold' : (Math.abs(a-100) <= 3 && Math.abs(b-100) <= 3 ? 'similar' : (a < 100 && b < 100 ? 'low' : (a > 100 && b > 100 ? 'high' : 'mixed')));
  return { ...i, cls };
}).sort((x, y) => (x.trad_vs_big_pct_median ?? 999) - (y.trad_vs_big_pct_median ?? 999));
const row = i => [`${short(i.item)} (${unitOf(i.item)})`, fmt(i.trad_median), fmt(i.big_median),
  i.cls === 'hold' ? '판정 보류' : `${pct(i.trad_vs_big_pct_median)} (평균 ${pct(i.trad_vs_big_pct_mean)})`, `${i.trad_n} / ${i.big_n}곳`];
const H = ['품목(단위)', '전통시장 중앙값(원)', '대형유통 중앙값(원)', '전통/대형 중앙값', '표본 전통/대형'];
const W = [0.24, 0.17, 0.17, 0.24, 0.18];
const ord = { similar: 0, mixed: 1, high: 2, hold: 3 };
const low = fish.filter(i => i.cls === 'low'), rest = fish.filter(i => i.cls !== 'low').sort((x, y) => ord[x.cls] - ord[y.cls]);
let page = 1;
const chunk = (a, n) => a.length ? Array.from({ length: Math.ceil(a.length / n) }, (_, k) => a.slice(k * n, k * n + n)) : [];
chunk(low, 8).forEach((g, k) => S.layouts.table(deck.addSlide(), {
  frame: { kicker: kick, headline: `수산물 ${low.length}개 품목은 전통시장 가격이 대형유통보다 낮다`,
    note: '시장별 기간 평균의 채널별 중앙값 비교(괄호는 평균 기준). 평균·중앙값 기준이 모두 100% 미만인 품목만 포함.\n대형유통 가격은 멤버십·정부할인지원 포함, 카드 전용 할인 제외. 전국 조사 시장 기준이며 특정 시장 가격이 아님.',
    sources: [KAMIS, REPO], page: page++ },
  table: { headers: H, rows: g.map(row), colW: W } }));
const ns = rest.filter(i => i.cls === 'similar').length, nh = rest.filter(i => i.cls === 'high').length, nm = rest.filter(i => i.cls === 'mixed').length, nd = rest.filter(i => i.cls === 'hold').length;
const lab = { similar: '비슷(±3%)', high: '전통시장 높음', mixed: '기준별 엇갈림', hold: '표본 부족' };
chunk(rest, 8).forEach(g => S.layouts.table(deck.addSlide(), {
  frame: { kicker: kick, headline: `나머지 ${rest.length}개 품목은 전통시장이 싸다고 보기 어렵다`,
    note: `구분: 비슷(평균·중앙값 모두 ±3% 이내) ${ns}개, 전통시장 높음 ${nh}개, 평균·중앙값 판정 엇갈림 ${nm}개, 한쪽 표본 5곳 미만 ${nd}개.\n표본 부족 품목은 비교 결론에 사용하지 않음.`,
    sources: [KAMIS, REPO], page: page++ },
  table: { headers: ['품목(단위)', '전통시장 중앙값(원)', '대형유통 중앙값(원)', '전통/대형 중앙값', '판정'],
    rows: g.map(i => { const r = row(i); r[4] = lab[i.cls]; return r; }), colW: W } }));

// 축산: 한우 1+ 4부위, 돼지 2부위, 닭, 계란30
const pick = [['소','등심','1+등급'],['소','안심','1+등급'],['소','양지','1+등급'],['소','설도','1+등급'],['돼지','삼겹살',null],['돼지','목심',null],['닭','육계(kg)',null],['계란','XL30구','일반란']];
const li = pick.map(([s,p,g]) => L.items.find(i => i.species===s && i.part===p && (i.grade||null)===g)).filter(Boolean);
const nm2 = i => i.species==='소' ? `한우 ${i.part} 1+(100g)` : i.species==='돼지' ? `돼지 ${i.part}(100g)` : i.species==='닭' ? '닭 육계(kg)' : '계란 XL 30구';
const per = i => '';
const lr = li.map(i => { i = { ...i, super_vs_mart_pct: r100(i.super.mean31, i.mart.mean31), butcher_vs_mart_pct: r100(i.butcher.mean31, i.mart.mean31) }; return [nm2(i), fmt(i.mart.mean31)+per(i), fmt(i.super.mean31)+per(i), i.butcher.mean31 ? fmt(i.butcher.mean31)+per(i) : '미조사',
  [i.super_vs_mart_pct!=null?`슈퍼 ${pct(i.super_vs_mart_pct)}`:null, i.butcher_vs_mart_pct!=null?`정육점 ${pct(i.butcher_vs_mart_pct)}`:null].filter(Boolean).join(' · ')]; });
const hanwoo = li.filter(i => i.species==='소').map(i => r100(i.butcher.mean31, i.mart.mean31));
S.layouts.table(deck.addSlide(), {
  frame: { kicker: `${STATUS} / ${snap} 수집본 · 조사기간 ${L.period}`,
    headline: `한우 1+등급은 정육점이 대형마트의 ${Math.min(...hanwoo).toFixed(0)}~${Math.max(...hanwoo).toFixed(0)}% 수준이고 돼지고기는 차이가 작다`,
    note: "31일 평균. 비율은 표의 평균가로 계산. 대형마트=이마트·홈플러스·롯데마트, 슈퍼=SSM·농축협·일반마트. '정육점'은 전통시장 내 정육점을 포함하지만 전통시장 가격은 아님.\n한우 차이에는 브랜드·정형·등급 구성 차이가 섞였을 수 있음(미검증). 닭·계란은 정육점 미조사.",
    sources: [EKAPE, REPO], page: page++ },
  table: { headers: ['품목(단위)', '대형마트(원)', '슈퍼마켓(원)', '정육점(원)', '대형마트 대비'], rows: lr, colW: [0.22, 0.17, 0.17, 0.17, 0.27] } });

await deck.writeFile({ fileName: OUT });
console.log(JSON.stringify({ warnings: S.warnings, diagnostics: S.diagnostics, slides: page - 1, low: low.length, rest: rest.length }));
