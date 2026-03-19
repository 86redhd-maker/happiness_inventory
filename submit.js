/* =============================================
   행복 인벤토리 — 제출 & PDF 생성
   submit.js
   ============================================= */

/* ── Google Apps Script 웹앱 URL ──
   배포 후 이 URL을 실제 주소로 교체하세요 */
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';

/* ── 전송 데이터 구성 ── */
function buildSubmitData() {
  const inventoryMap = {};
  for (let rank = 1; rank <= 6; rank++) {
    const inv = state.inventory.find(i => i.rank === rank);
    if (inv) {
      inventoryMap[`rank${rank}`] = {
        code: inv.code,
        name: inv.name,
        concept: inv.concept
      };
    }
  }

  const notSelected = getNotSelectedItems().map(i => i.code);

  const mission2Data = {};
  state.curses.forEach((curse, idx) => {
    const key = `curse${idx + 1}`;
    const m2 = state.mission2[key];
    const newItem = m2.newItemCode ? getItemByCode(m2.newItemCode) : null;
    mission2Data[key] = {
      rank: curse.rank,
      itemName: curse.itemName,
      curseType: curse.curseType,
      affectedRank: curse.affectedRank,
      affectedItemName: curse.affectedItemName,
      choice: m2.choice,
      newItem: newItem ? { code: newItem.code, name: newItem.name } : null,
      response: m2.response,
      charCount: m2.charCount
    };
  });

  const item1 = state.mission3.item1Code ? getItemByCode(state.mission3.item1Code) : null;
  const item2 = state.mission3.item2Code ? getItemByCode(state.mission3.item2Code) : null;

  return {
    timestamp: new Date().toISOString(),
    studentId: state.studentId,
    studentName: state.studentName,
    inventory: inventoryMap,
    notSelected,
    securityCode: state.securityCode,
    mission1: {
      q1: {
        itemName: state.inventory.find(i => i.rank === 1)?.name,
        response: state.mission1.q1.response,
        charCount: state.mission1.q1.charCount
      },
      q2: {
        itemName: state.inventory.find(i => i.rank === 2)?.name,
        response: state.mission1.q2.response,
        charCount: state.mission1.q2.charCount
      },
      q3: {
        itemName: state.inventory.find(i => i.rank === 3)?.name,
        response: state.mission1.q3.response,
        charCount: state.mission1.q3.charCount
      }
    },
    mission2: mission2Data,
    mission3: {
      item1: item1 ? { code: item1.code, name: item1.name } : null,
      item2: item2 ? { code: item2.code, name: item2.name } : null,
      newItemName: state.mission3.newItemName,
      newItemDesc: state.mission3.newItemDesc,
      happinessResponse: state.mission3.happinessResponse,
      charCount: state.mission3.charCount
    }
  };
}

/* ── 제출 함수 ── */
async function submitData() {
  const statusEl = document.getElementById('submit-status');
  const submitBtn = document.getElementById('btn-submit-final');

  statusEl.textContent = '⏳ 제출 중입니다...';
  statusEl.className = 'submit-status loading';
  submitBtn.disabled = true;

  const data = buildSubmitData();

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
    });

    if (response.ok || response.type === 'opaqueredirect') {
      state.submitted = true;
      statusEl.textContent = '✅ 제출이 완료되었습니다!';
      statusEl.className = 'submit-status success';
      setTimeout(() => {
        showScreen('screen-done');
        document.getElementById('done-student-info').textContent =
          `${state.studentId} ${state.studentName}`;
        document.getElementById('btn-done-pdf').onclick = downloadPDF;
      }, 1000);
    } else {
      throw new Error(`서버 응답 오류: ${response.status}`);
    }
  } catch (err) {
    console.error('제출 오류:', err);
    statusEl.innerHTML = `❌ 제출에 실패했습니다. 다시 시도해주세요.<br/><small style="font-weight:300">${err.message}</small>`;
    statusEl.className = 'submit-status error';
    submitBtn.disabled = false;

    // 재시도 버튼 추가
    const retryBtn = document.createElement('button');
    retryBtn.className = 'btn-danger';
    retryBtn.style.cssText = 'margin-top:12px;display:block;margin-left:auto;margin-right:auto';
    retryBtn.textContent = '다시 시도';
    retryBtn.onclick = () => { retryBtn.remove(); submitData(); };
    statusEl.after(retryBtn);
  }
}

/* ── 인쇄/PDF 저장 ──
   브라우저 인쇄 기능 활용 — 한글 완벽 지원
   인쇄 창에서 "PDF로 저장" 선택 가능
*/
function downloadPDF() {
  // 인쇄용 창 생성
  const printWin = window.open('', '_blank');
  if (!printWin) {
    alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.');
    return;
  }

  const notSelected = getNotSelectedItems().map(i => i.name).join(', ');
  const curseLabels = { A: '저주A', B: '저주B', C: '저주C' };

  // 미션2 저주 HTML
  const mission2HTML = state.curses.map((curse, idx) => {
    const key = `curse${idx + 1}`;
    const data = state.mission2[key];
    const replaceItem = data.newItemCode ? getItemByCode(data.newItemCode)?.name : '';
    return `
      <div class="block">
        <div class="block-header">(${idx+1}) ${curseLabels[curse.curseType]} → ${curse.rank}순위: ${curse.itemName}</div>
        <div class="meta">선택: ${data.choice || '(미선택)'}${replaceItem ? ' → ' + replaceItem : ''} · ${data.charCount}자</div>
        <div class="response">${data.response || '(미작성)'}</div>
      </div>
    `;
  }).join('');

  // 미션1 HTML
  const mission1HTML = [1,2,3].map(rank => {
    const inv = state.inventory.find(i => i.rank === rank);
    const key = `q${rank}`;
    const data = state.mission1[key];
    return `
      <div class="block">
        <div class="block-header">(${rank}) ${rank}순위: ${inv?.name}</div>
        <div class="meta">${data.charCount}자</div>
        <div class="response">${data.response || '(미작성)'}</div>
      </div>
    `;
  }).join('');

  // 인벤토리 HTML
  const inventoryHTML = state.inventory
    .sort((a,b) => a.rank - b.rank)
    .map(inv => `<div class="inv-row"><span class="rank-tag">${inv.rank}순위</span> ${inv.name} <span class="concept">(${inv.concept})</span></div>`)
    .join('');

  const item1Name = state.mission3.item1Code ? getItemByCode(state.mission3.item1Code)?.name : '(미선택)';
  const item2Name = state.mission3.item2Code ? getItemByCode(state.mission3.item2Code)?.name : '(미선택)';

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>행복 인벤토리 — ${state.studentId} ${state.studentName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;700&display=swap" rel="stylesheet"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Noto Sans KR', sans-serif; font-size: 12px; color: #1a1a2e; line-height: 1.7; padding: 20px 28px; }
    h1 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
    .subtitle { font-size: 11px; color: #888; margin-bottom: 16px; }
    .info-row { display: flex; gap: 24px; margin-bottom: 16px; font-size: 12px; }
    .info-item { display: flex; gap: 6px; }
    .info-label { font-weight: 700; color: #5a5a7a; }
    .section { margin-bottom: 20px; page-break-inside: avoid; }
    .section-title { font-size: 11px; font-weight: 700; color: #4a7fd4; letter-spacing: 1.5px; text-transform: uppercase; border-bottom: 2px solid #e0eaff; padding-bottom: 4px; margin-bottom: 12px; }
    .inv-row { margin-bottom: 4px; }
    .rank-tag { display: inline-block; background: #4a7fd4; color: #fff; font-size: 10px; font-weight: 700; padding: 1px 7px; margin-right: 6px; }
    .concept { color: #4a7fd4; font-size: 11px; }
    .not-selected { color: #888; font-size: 11px; margin-top: 6px; }
    .block { margin-bottom: 14px; padding: 10px 12px; border-left: 3px solid #4a7fd4; background: #f8f9ff; page-break-inside: avoid; }
    .block-header { font-weight: 700; margin-bottom: 4px; }
    .meta { font-size: 10px; color: #888; margin-bottom: 6px; }
    .response { color: #2c2c3e; white-space: pre-wrap; line-height: 1.8; }
    .craft-row { margin-bottom: 6px; }
    .craft-label { font-weight: 700; color: #5a5a7a; }
    @media print {
      body { padding: 10px 20px; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>행복 인벤토리 — 수행평가 답안</h1>
  <div class="subtitle">통합사회1 · 2단원 · ${new Date().toLocaleString('ko-KR')}</div>

  <div class="info-row">
    <div class="info-item"><span class="info-label">학번</span> ${state.studentId}</div>
    <div class="info-item"><span class="info-label">이름</span> ${state.studentName}</div>
    <div class="info-item"><span class="info-label">보안코드</span> ${state.securityCode.join('-')}</div>
  </div>

  <div class="section">
    <div class="section-title">[ 인벤토리 ]</div>
    ${inventoryHTML}
    <div class="not-selected">미선택: ${notSelected}</div>
  </div>

  <div class="section">
    <div class="section-title">[ MISSION 1 — 나의 행복 스캔 ]</div>
    ${mission1HTML}
  </div>

  <div class="section">
    <div class="section-title">[ MISSION 2 — 저주 이벤트 ]</div>
    ${mission2HTML}
  </div>

  <div class="section">
    <div class="section-title">[ MISSION 3 — 아이템 크래프팅 ]</div>
    <div class="block">
      <div class="craft-row"><span class="craft-label">조합:</span> ${item1Name} + ${item2Name}</div>
      <div class="craft-row"><span class="craft-label">새 아이템:</span> ${state.mission3.newItemName || '(미입력)'}</div>
      <div class="craft-row"><span class="craft-label">설명:</span> ${state.mission3.newItemDesc || '(미입력)'}</div>
      <div class="meta">행복 서술 · ${state.mission3.charCount}자</div>
      <div class="response">${state.mission3.happinessResponse || '(미작성)'}</div>
    </div>
  </div>
</body>
</html>`;

  printWin.document.write(html);
  printWin.document.close();

  // 폰트 로딩 후 인쇄 창 열기
  printWin.onload = () => {
    setTimeout(() => {
      printWin.focus();
      printWin.print();
    }, 600);
  };
}

/* ─────────────────────────────────────────────
   Google Apps Script 코드 (별도 파일로 배포)
   아래 코드를 Apps Script 에디터에 붙여넣고
   웹앱으로 배포하세요.
   
   배포 설정:
   - 실행: 나(스크립트 소유자)
   - 액세스: 모든 사용자 (로그인 불필요)
   
   배포 URL을 위의 APPS_SCRIPT_URL에 넣으세요.
─────────────────────────────────────────────── */

/*
// ============================================================
// Apps Script 코드 (이 파일이 아닌 Apps Script에 붙여넣기)
// ============================================================

const SHEET_NAME_SUMMARY = '요약';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 요약 시트 처리
    updateSummarySheet(ss, data);
    
    // 학생 개별 시트 처리
    updateStudentSheet(ss, data);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function updateSummarySheet(ss, data) {
  let sheet = ss.getSheetByName(SHEET_NAME_SUMMARY);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_SUMMARY);
    sheet.appendRow(['학번', '이름', '제출시각', '보안코드', '개별시트링크']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  
  const sheetName = `${data.studentId}_${data.studentName}`;
  const ss_url = ss.getUrl();
  const sheetUrl = `${ss_url}#gid=${getSheetGid(ss, sheetName)}`;
  
  const allData = sheet.getDataRange().getValues();
  
  // 기존 행 찾기 (학번 기준)
  let existingRow = -1;
  for (let i = 1; i < allData.length; i++) {
    if (String(allData[i][0]) === String(data.studentId)) {
      existingRow = i + 1;
      break;
    }
  }
  
  const timestamp = new Date(data.timestamp).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  const rowData = [
    data.studentId,
    data.studentName,
    timestamp,
    data.securityCode.join('-'),
    sheetUrl
  ];
  
  if (existingRow > 0) {
    sheet.getRange(existingRow, 1, 1, 5).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  
  // 학번 기준 오름차순 정렬 (헤더 제외)
  const lastRow = sheet.getLastRow();
  if (lastRow > 2) {
    sheet.getRange(2, 1, lastRow - 1, 5).sort({ column: 1, ascending: true });
  }
}

function getSheetGid(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  return sheet ? sheet.getSheetId() : 0;
}

function updateStudentSheet(ss, data) {
  const sheetName = `${data.studentId}_${data.studentName}`;
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clearContents();
  }
  
  const rows = [];
  
  // 기본 정보
  rows.push(['[기본 정보]', '']);
  rows.push(['학번', data.studentId]);
  rows.push(['이름', data.studentName]);
  rows.push(['제출시각', new Date(data.timestamp).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })]);
  rows.push(['', '']);
  
  // 인벤토리
  rows.push(['[인벤토리]', '']);
  for (let rank = 1; rank <= 6; rank++) {
    const inv = data.inventory[`rank${rank}`];
    if (inv) rows.push([`${rank}순위`, `${inv.name} (${inv.concept})`]);
  }
  
  const notSelectedItems = ITEMS_DATA.filter(i => data.notSelected.includes(i.code)).map(i => i.name);
  rows.push(['미선택', notSelectedItems.join(', ')]);
  rows.push(['보안 코드', data.securityCode.join('-')]);
  rows.push(['', '']);
  
  // 미션1
  rows.push(['[MISSION 1 — 나의 행복 스캔]', '']);
  ['q1','q2','q3'].forEach((key, idx) => {
    const q = data.mission1[key];
    rows.push([`(${idx+1}) ${idx+1}순위: ${q.itemName}`, '']);
    rows.push(['글자수', `${q.charCount}자`]);
    rows.push(['서술', q.response]);
    rows.push(['', '']);
  });
  
  // 미션2
  rows.push(['[MISSION 2 — 저주 이벤트]', '']);
  const curseLabels = { A: '저주A', B: '저주B', C: '저주C' };
  ['curse1','curse2','curse3'].forEach((key, idx) => {
    const c = data.mission2[key];
    rows.push([`(${idx+1}) ${curseLabels[c.curseType]} → ${c.rank}순위: ${c.itemName}`, '']);
    rows.push(['선택', c.choice + (c.newItem ? ` → ${c.newItem.name}` : '')]);
    rows.push(['글자수', `${c.charCount}자`]);
    rows.push(['서술', c.response]);
    rows.push(['', '']);
  });
  
  // 미션3
  rows.push(['[MISSION 3 — 아이템 크래프팅]', '']);
  rows.push(['조합', `${data.mission3.item1?.name || ''} + ${data.mission3.item2?.name || ''}`]);
  rows.push(['새 아이템', data.mission3.newItemName]);
  rows.push(['설명', data.mission3.newItemDesc]);
  rows.push(['행복 서술 글자수', `${data.mission3.charCount}자`]);
  rows.push(['행복 서술', data.mission3.happinessResponse]);
  
  // 시트에 쓰기
  if (rows.length > 0) {
    sheet.getRange(1, 1, rows.length, 2).setValues(rows);
  }
  
  // 스타일
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 500);
  sheet.getRange(1, 1, rows.length, 1).setFontWeight('bold');
  
  // 섹션 헤더 강조
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0].startsWith('[')) {
      sheet.getRange(i + 1, 1, 1, 2).setBackground('#e8f0fc').setFontWeight('bold');
    }
  }
  
  // 텍스트 줄바꿈
  sheet.getRange(1, 2, rows.length, 1).setWrap(true);
}

// 아이템 데이터 (Apps Script에서도 참조용)
const ITEMS_DATA = [
  { code: 'A', name: '무한리필 통장', concept: '경제적 안정' },
  { code: 'B', name: '히포크라테스의 빨간 약', concept: '건강' },
  { code: 'C', name: '레벨업의 돋보기', concept: '자아실현' },
  { code: 'D', name: '끊어지지 않는 실전화기', concept: '의미 있는 관계' },
  { code: 'E', name: '파이브스타 달팽이', concept: '질 높은 정주 환경' },
  { code: 'F', name: '만인의 확성기', concept: '민주주의와 자유' },
  { code: 'G', name: '황금 티켓 뭉치', concept: '여가와 문화생활' },
  { code: 'H', name: '거울 도끼', concept: '도덕적 실천' },
  { code: 'I', name: '스포트라이트 배지', concept: '사회적 인정' },
  { code: 'J', name: '전설의 유리 거북이', concept: '안전' }
];
*/
