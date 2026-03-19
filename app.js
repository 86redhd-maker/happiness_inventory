/* =============================================
   행복 인벤토리 — 메인 앱 로직
   app.js
   ============================================= */

/* ── 아이템 데이터 ── */
const ITEMS = [
  {
    code: 'A', name: '무한리필 통장', concept: '경제적 안정',
    icon: '💳',
    iconImg: 'assets/icons/A.png',
    desc: '잔고가 바닥나지 않는 마법의 통장. 먹고사는 걱정은 이제 끝. 단, 사치를 부리면 잔고가 줄어든다는 소문이 있다.'
  },
  {
    code: 'B', name: '히포크라테스의 빨간 약', concept: '건강',
    icon: '💊',
    iconImg: 'assets/icons/B.png',
    desc: '한 모금이면 어떤 병도 낫는 만병통치약. 몸도 마음도 건강해진다. 유통기한은 영원.'
  },
  {
    code: 'C', name: '레벨업의 돋보기', concept: '자아실현',
    icon: '🔍',
    iconImg: 'assets/icons/C.png',
    desc: '이것을 들고 무언가에 몰두하면, 어제보다 오늘 더 나은 내가 된다. 꿈을 향해 성장하고 있다는 확신이 들게 해주는 아이템.'
  },
  {
    code: 'D', name: '끊어지지 않는 실전화기', concept: '의미 있는 관계',
    icon: '📞',
    iconImg: 'assets/icons/D.png',
    desc: '소중한 사람과 언제든 연결되는 전화기. 외로울 때 받아주는 사람이 항상 있다. 배터리 무한.'
  },
  {
    code: 'E', name: '파이브스타 달팽이', concept: '질 높은 정주 환경',
    icon: '🐌',
    iconImg: 'assets/icons/E.png',
    desc: '등에 5성급 호텔을 지고 다니는 달팽이. 어디서든 쾌적하고 안전한 공간을 만들어준다. 냉난방 완비, 방음 완벽.'
  },
  {
    code: 'F', name: '만인의 확성기', concept: '민주주의와 자유',
    icon: '📢',
    iconImg: 'assets/icons/F.png',
    desc: '내 목소리가 반드시 전달되는 확성기. 부당한 일에 항의할 수 있고, 내가 원하는 삶에 대해 의견을 낼 권리가 보장된다. 이 확성기가 있는 한, 누구도 당신의 말을 무시할 수 없다. 음량 조절 가능.'
  },
  {
    code: 'G', name: '황금 티켓 뭉치', concept: '여가와 문화생활',
    icon: '🎫',
    iconImg: 'assets/icons/G.png',
    desc: '이 티켓 한 장이면 세상 어디든, 어떤 공연이든, 어떤 경기장이든 입장할 수 있다. 보고 싶은 건 다 보고, 하고 싶은 건 다 하고, 가고 싶은 곳은 다 갈 수 있다. 무한 리필.'
  },
  {
    code: 'H', name: '거울 도끼', concept: '도덕적 실천',
    icon: '🪓',
    iconImg: 'assets/icons/H.png',
    desc: '한쪽 면은 도끼, 한쪽 면은 거울. 옳지 않은 일 앞에서 도끼를 들면 바로잡을 용기가 생기고, 거울을 보면 내가 정말 옳은 쪽에 서 있는지 비춰준다. 들기엔 좀 무겁고, 가끔 보기 싫은 내 모습이 비친다.'
  },
  {
    code: 'I', name: '스포트라이트 배지', concept: '사회적 인정',
    icon: '🏅',
    iconImg: 'assets/icons/I.png',
    desc: '이 배지를 달면 내 노력과 재능이 다른 사람의 눈에 보인다. 무대에 서지 않아도 인정받을 수 있다. 조명이 좀 뜨겁긴 하다.'
  },
  {
    code: 'J', name: '전설의 유리 거북이', concept: '안전',
    icon: '🐢',
    iconImg: 'assets/icons/J.png',
    desc: '등딱지가 투명한 유리로 된 거북이. 위험이 다가오면 이 거북이가 당신 위로 올라와 등딱지로 모든 걸 막아준다. 범죄, 재난, 사고 — 어떤 위협도 유리 등딱지를 뚫지 못한다. 투명해서 안 보이지만 항상 당신 옆에 있다.'
  }
];

/* ── 저주 데이터 ── */
const CURSES = {
  A: {
    label: '저주A',
    getContent: (inv) => {
      const rank1Item = inv.find(i => i.rank === 1);
      const rank2Item = inv.find(i => i.rank === 2);
      // 기본: 1순위 효과 약화 / 저주A가 1순위에 걸리면 2순위 약화
      // (affectedRank는 배정 시 결정)
      return null; // 런타임에 계산
    },
    template: (affectedRank, affectedName, curseAOnFirst) => {
      const weakenTarget = curseAOnFirst
        ? `2순위 아이템(${affectedName})의 효과가 약해집니다.`
        : `1순위 아이템(${affectedName})의 효과가 약해집니다.`;
      return `이 아이템을 사용할 때마다 <strong>${weakenTarget}</strong> 가장 소중한 것을 쓸수록, 가장 먼저 넣은 것이 사라져갑니다.`;
    }
  },
  B: {
    label: '저주B',
    template: () =>
      `이 아이템은 <strong>하루에 딱 1시간만 작동합니다.</strong> 사용을 시작한 순간부터 정확히 1시간이 지나면 자동으로 꺼지며, 다시 켜려면 그 시작 시간으로부터 24시간이 지나야 합니다. 1시간을 분 단위로 쪼개 쓸 수 없고, 아무리 긴급한 상황이라도 1시간이 지나면 이 아이템은 절대 작동하지 않습니다. 언제 사용을 시작할지는 당신이 선택할 수 있습니다.`
  },
  C: {
    label: '저주C',
    template: () =>
      `이 아이템은 <strong>오직 당신에게만 작동합니다.</strong> 당신을 제외한 모든 사람들은 이 아이템을 절대 사용할 수 없으며, 만약 사용하더라도 효과가 전혀 나타나지 않습니다.`
  }
};

/* ── 앱 상태 ── */
const state = {
  studentId: '',
  studentName: '',
  selectedItems: [],       // 선택한 아이템 code 배열 (순서 무관)
  inventory: [],           // [{rank:1, code:'A', name:..., concept:...}, ...]
  inventoryLocked: false,  // 보안코드 설정 후 잠금
  curseIntroSeen: false,   // 저주 인트로 확인 후 true → 보안코드 재설정 차단
  mission1Visited: false,  // 미션1 방문 후 true → 미션2 네비 접근 가능
  submitted: false,        // 제출 완료 후 true → 재제출 방지
  securityCode: [],        // [a, b, c]
  curses: [],              // [{rank, itemCode, itemName, curseType, ...}, ...]
  mission1: {
    q1: { response: '', charCount: 0 },
    q2: { response: '', charCount: 0 },
    q3: { response: '', charCount: 0 }
  },
  mission2: {
    curse1: { choice: '', newItemCode: '', response: '', charCount: 0 },
    curse2: { choice: '', newItemCode: '', response: '', charCount: 0 },
    curse3: { choice: '', newItemCode: '', response: '', charCount: 0 }
  },
  mission3: {
    item1Code: '',
    item2Code: '',
    newItemName: '',
    newItemDesc: '',
    happinessResponse: '',
    charCount: 0
  }
};

/* ── 화면 전환 ── */
let currentScreen = 'screen-login';

// 드래그 이벤트 클린업용
let dragCleanupFns = [];

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    currentScreen = id;
    window.scrollTo(0, 0);
    updateNavBar(id);
  }
}

function updateNavBar(screenId) {
  const nav = document.getElementById('progress-nav');
  const showAfter = ['screen-mission1','screen-curse-intro','screen-mission2','screen-mission3','screen-submit','screen-done'];
  // 인벤토리 화면도 네비에 포함
  const navScreens = ['screen-inventory','screen-mission1','screen-curse-intro','screen-mission2','screen-mission3','screen-submit'];

  if (state.inventoryLocked && navScreens.includes(screenId)) {
    nav.style.display = 'flex';
  } else {
    nav.style.display = 'none';
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active-nav', btn.dataset.target === screenId);
  });
}

/* ── 유틸 ── */
function getItemByCode(code) {
  return ITEMS.find(i => i.code === code);
}
function getInventoryItem(rank) {
  return state.inventory.find(i => i.rank === rank);
}
function getNotSelectedItems() {
  return ITEMS.filter(i => !state.selectedItems.includes(i.code));
}
function getItemIcon(item) {
  // 이미지가 있으면 img 태그, 없으면 이모지
  return `<span class="mini-icon">${item.icon}</span>`;
}
function getItemIconFull(item) {
  const hasImg = item.iconImg;
  if (hasImg) {
    return `<div class="item-icon"><img src="${item.iconImg}" alt="${item.name}" onerror="this.style.display='none';this.parentNode.innerHTML='<span class=\\'item-icon-emoji\\'>${item.icon}</span>'"/></div>`;
  }
  return `<div class="item-icon"><span class="item-icon-emoji">${item.icon}</span></div>`;
}

/* ── 1. 로그인 ── */
function initLogin() {
  const btnLogin = document.getElementById('btn-login');
  const inputId = document.getElementById('input-student-id');
  const inputName = document.getElementById('input-student-name');
  const hintId = document.getElementById('hint-student-id');
  const hintName = document.getElementById('hint-student-name');

  function validate() {
    let ok = true;
    const idVal = inputId.value.trim();
    const nameVal = inputName.value.trim();

    if (!/^\d{5}$/.test(idVal)) {
      hintId.textContent = '학번은 5자리 숫자여야 합니다.';
      ok = false;
    } else {
      hintId.textContent = '';
    }
    if (!nameVal) {
      hintName.textContent = '이름을 입력하세요.';
      ok = false;
    } else {
      hintName.textContent = '';
    }
    return ok;
  }

  inputId.addEventListener('input', () => {
    inputId.value = inputId.value.replace(/[^0-9]/g, '').slice(0, 5);
  });

  btnLogin.addEventListener('click', () => {
    if (!validate()) return;
    state.studentId = document.getElementById('input-student-id').value.trim();
    state.studentName = document.getElementById('input-student-name').value.trim();
    showScreen('screen-tutorial');
    playTutorial();
  });

  [inputId, inputName].forEach(el => {
    el.addEventListener('keydown', e => { if (e.key === 'Enter') btnLogin.click(); });
  });
}

/* ── 2. 튜토리얼 타이핑 효과 ── */
const TUTORIAL_TEXT = `[SYSTEM] 전송 준비 중...

눈을 떠보니 아무것도 없는 하얀 공간입니다.
주머니에 손을 넣어보면 — 아무것도 없습니다.
이름도, 지갑도, 핸드폰도 사라졌습니다.

대신 눈앞에 낡은 자판기 하나가 서 있고, 화면에 이런 문장이 떠 있습니다.

"새로운 세계에 오신 것을 환영합니다.
이곳에서 당신의 삶은 지금부터 시작됩니다.
아래 자판기에서 아이템 6개를 뽑으세요.
뽑지 않은 아이템은 이 세계에 존재하지 않습니다.
선택을 마치면 자판기는 사라집니다."

자판기 버튼은 10개. 하지만 뽑을 수 있는 건 6개뿐.
어떤 삶을 시작할지, 당신이 고르세요.`;

function playTutorial() {
  const body = document.getElementById('tutorial-text');
  const btn = document.getElementById('btn-tutorial-next');
  btn.style.display = 'none';
  body.textContent = '';
  let cursor = document.createElement('span');
  cursor.className = 'terminal-cursor';

  let i = 0;
  const speed = 28;

  function type() {
    if (i < TUTORIAL_TEXT.length) {
      body.textContent = TUTORIAL_TEXT.slice(0, i + 1);
      body.appendChild(cursor);
      i++;
      setTimeout(type, speed);
    } else {
      btn.style.display = 'block';
    }
  }

  // 클릭하면 스킵
  body.addEventListener('click', () => {
    i = TUTORIAL_TEXT.length;
    body.textContent = TUTORIAL_TEXT;
    btn.style.display = 'block';
  }, { once: true });

  type();

  btn.onclick = () => {
    showScreen('screen-items');
    renderItemGrid();
  };
}

/* ── 3. 아이템 선택 ── */
function renderItemGrid() {
  const grid = document.getElementById('items-grid');
  grid.innerHTML = '';

  ITEMS.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card' + (state.selectedItems.includes(item.code) ? ' selected' : '');
    card.dataset.code = item.code;
    card.innerHTML = `
      ${getItemIconFull(item)}
      <div class="item-info">
        <div class="item-card-top">
          <span class="item-concept">${item.concept}</span>
          <span class="item-code">${item.code}</span>
        </div>
        <div class="item-name">${item.name}</div>
        <div class="item-desc">${item.desc}</div>
      </div>
      <div class="item-check">✓</div>
    `;
    card.addEventListener('click', () => toggleItem(item.code));
    grid.appendChild(card);
  });

  updateSelectCounter();
}

function toggleItem(code) {
  if (state.selectedItems.includes(code)) {
    state.selectedItems = state.selectedItems.filter(c => c !== code);
  } else {
    if (state.selectedItems.length >= 6) return;
    state.selectedItems.push(code);
  }
  updateItemGrid();
  updateSelectCounter();
}

function updateItemGrid() {
  const allCards = document.querySelectorAll('.item-card');
  allCards.forEach(card => {
    const code = card.dataset.code;
    const isSelected = state.selectedItems.includes(code);
    const isFull = state.selectedItems.length >= 6;
    card.classList.toggle('selected', isSelected);
    card.classList.toggle('disabled', isFull && !isSelected);
  });
}

function updateSelectCounter() {
  document.getElementById('selected-count').textContent = state.selectedItems.length;
  document.getElementById('btn-items-next').disabled = state.selectedItems.length !== 6;
}

function initItemSelection() {
  document.getElementById('btn-items-next').addEventListener('click', () => {
    if (state.selectedItems.length !== 6) return;
    // 인벤토리 초기화 (순위 미지정 상태)
    state.inventory = [];
    showScreen('screen-inventory');
    renderInventory();
  });
}

/* ── 4. 인벤토리 드래그&드롭 ── */

function renderInventory() {
  const pool = document.getElementById('card-pool');
  pool.innerHTML = '';

  // 잠금 메시지
  const existingLock = document.querySelector('.inventory-locked-msg');
  if (existingLock) existingLock.remove();

  if (state.inventoryLocked) {
    const lockMsg = document.createElement('div');
    lockMsg.className = 'inventory-locked-msg';
    lockMsg.textContent = '⚠ 보안 코드가 설정되어 인벤토리 순서를 변경할 수 없습니다.';
    document.querySelector('#screen-inventory .screen-inner').insertBefore(
      lockMsg, document.querySelector('#screen-inventory .inventory-layout')
    );
  }

  // 슬롯 초기화
  for (let rank = 1; rank <= 6; rank++) {
    const zone = document.querySelector(`.slot-drop-zone[data-rank="${rank}"]`);
    zone.innerHTML = '';
    zone.classList.remove('filled', 'drag-over');
    const existing = state.inventory.find(i => i.rank === rank);
    if (existing) {
      const item = getItemByCode(existing.code);
      zone.appendChild(createMiniCard(item));
      zone.classList.add('filled');
    }
  }

  // 풀에 순위 미배정 아이템
  const rankedCodes = state.inventory.map(i => i.code);
  state.selectedItems.forEach(code => {
    if (!rankedCodes.includes(code)) {
      const item = getItemByCode(code);
      pool.appendChild(createMiniCard(item));
    }
  });

  if (!state.inventoryLocked) {
    initDragDrop();
  }

  updateInventoryStatus();

  // 버튼 (뒤로 가기는 아이템 선택으로)
  document.getElementById('btn-inventory-back').onclick = () => {
    if (state.inventoryLocked) return;
    showScreen('screen-items');
    renderItemGrid();
  };
  document.getElementById('btn-inventory-next').onclick = () => {
    if (!isInventoryComplete()) {
      document.getElementById('inventory-status').textContent = '6개 아이템 모두 순위를 배정해주세요.';
      return;
    }
    // 저주 인트로를 이미 봤으면 보안코드 재설정 불가
    if (state.curseIntroSeen) {
      alert('이미 저주가 배정되어 보안 코드를 변경할 수 없습니다.');
      return;
    }
    showScreen('screen-security');
    renderSecurityScreen();
  };
}

function createMiniCard(item) {
  const card = document.createElement('div');
  card.className = 'mini-card';
  card.dataset.code = item.code;
  card.draggable = !state.inventoryLocked;

  const iconHtml = `<div class="mini-icon-wrap">
    <img src="${item.iconImg}" alt="${item.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
    <span class="mini-icon-emoji" style="display:none">${item.icon}</span>
  </div>`;

  card.innerHTML = `
    ${iconHtml}
    <div class="mini-text">
      <div class="mini-name">${item.name}</div>
      <div class="mini-concept">${item.concept}</div>
    </div>
  `;
  return card;
}

function initDragDrop() {
  // 이전 이벤트 리스너 정리
  dragCleanupFns.forEach(fn => fn());
  dragCleanupFns = [];

  const pool = document.getElementById('card-pool');
  const zones = document.querySelectorAll('.slot-drop-zone');

  let draggingCard = null;
  let draggingClone = null;
  let originZone = null;

  function getClientXY(e) {
    if (e.touches && e.touches.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    if (e.changedTouches && e.changedTouches.length > 0) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  function getElementAtPoint(x, y, exclude) {
    if (exclude) exclude.style.display = 'none';
    const el = document.elementFromPoint(x, y);
    if (exclude) exclude.style.display = '';
    return el;
  }

  function findSlotZone(el) {
    return el?.closest?.('.slot-drop-zone') || null;
  }
  function findPool(el) {
    return el?.closest?.('#card-pool') || null;
  }

  function startDrag(e, card) {
    if (state.inventoryLocked) return;
    draggingCard = card;
    originZone = card.closest('.slot-drop-zone') || card.closest('#card-pool');

    const { x, y } = getClientXY(e);
    const rect = card.getBoundingClientRect();

    draggingClone = card.cloneNode(true);
    draggingClone.style.cssText = `
      position: fixed; z-index: 9999; pointer-events: none; opacity: 0.88;
      width: ${rect.width}px; transform: translate(-50%,-50%) scale(1.05);
      left: ${x}px; top: ${y}px; box-shadow: 6px 6px 0 rgba(0,0,0,0.25);
    `;
    document.body.appendChild(draggingClone);
    card.classList.add('dragging');
    e.preventDefault();
  }

  function moveDrag(e) {
    if (!draggingCard) return;
    const { x, y } = getClientXY(e);
    draggingClone.style.left = `${x}px`;
    draggingClone.style.top = `${y}px`;

    zones.forEach(z => z.classList.remove('drag-over'));
    const el = getElementAtPoint(x, y, draggingClone);
    const zone = findSlotZone(el);
    if (zone) zone.classList.add('drag-over');
    e.preventDefault();
  }

  function endDrag(e) {
    if (!draggingCard) return;
    const { x, y } = getClientXY(e);

    const el = getElementAtPoint(x, y, draggingClone);
    const targetZone = findSlotZone(el);
    const targetPool = findPool(el);

    zones.forEach(z => z.classList.remove('drag-over'));

    if (targetZone) {
      dropToZone(draggingCard, targetZone);
    } else if (targetPool) {
      dropToPool(draggingCard);
    } else {
      restoreCard(draggingCard, originZone);
    }

    draggingCard.classList.remove('dragging');
    if (draggingClone) { draggingClone.remove(); draggingClone = null; }
    draggingCard = null;
    originZone = null;
    updateInventoryState();
    updateInventoryStatus();
  }

  function dropToZone(card, zone) {
    const existingCard = zone.querySelector('.mini-card');
    if (existingCard && existingCard !== card) {
      const originSlot = card.closest('.slot-drop-zone');
      if (originSlot) {
        originSlot.appendChild(existingCard);
        originSlot.classList.add('filled');
      } else {
        document.getElementById('card-pool').appendChild(existingCard);
      }
    }
    zone.innerHTML = '';
    zone.appendChild(card);
    zone.classList.add('filled');
  }

  function dropToPool(card) {
    const originSlot = card.closest('.slot-drop-zone');
    if (originSlot) {
      originSlot.innerHTML = '';
      originSlot.classList.remove('filled');
    }
    document.getElementById('card-pool').appendChild(card);
  }

  function restoreCard(card, origin) {
    if (origin) origin.appendChild(card);
  }

  const inventoryArea = document.querySelector('.inventory-layout');

  const onMouseDown = e => {
    const card = e.target.closest('.mini-card');
    if (card) startDrag(e, card);
  };
  const onMouseMove = e => moveDrag(e);
  const onMouseUp = e => endDrag(e);
  const onTouchStart = e => {
    const card = e.target.closest('.mini-card');
    if (card) startDrag(e, card);
  };
  const onTouchMove = e => moveDrag(e);
  const onTouchEnd = e => endDrag(e);

  inventoryArea.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  inventoryArea.addEventListener('touchstart', onTouchStart, { passive: false });
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', onTouchEnd);

  // 클린업 함수 등록
  dragCleanupFns.push(() => {
    inventoryArea.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    inventoryArea.removeEventListener('touchstart', onTouchStart);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  });
}

function updateInventoryState() {
  state.inventory = [];
  for (let rank = 1; rank <= 6; rank++) {
    const zone = document.querySelector(`.slot-drop-zone[data-rank="${rank}"]`);
    const card = zone?.querySelector('.mini-card');
    if (card) {
      const code = card.dataset.code;
      const item = getItemByCode(code);
      state.inventory.push({ rank, code, name: item.name, concept: item.concept });
    }
  }
}

function isInventoryComplete() {
  updateInventoryState();
  return state.inventory.length === 6;
}

function updateInventoryStatus() {
  const statusEl = document.getElementById('inventory-status');
  const btnNext = document.getElementById('btn-inventory-next');
  updateInventoryState();
  const filled = state.inventory.length;
  if (filled === 6) {
    statusEl.textContent = '✓ 모든 순위가 배정되었습니다!';
    btnNext.disabled = false;
  } else {
    statusEl.textContent = `${6 - filled}개 순위가 비어 있습니다.`;
    btnNext.disabled = true;
  }
}

/* ── 5. 보안 코드 ── */
function renderSecurityScreen() {
  // 저주 인트로 이후엔 보안코드 화면 접근 불가 — 미션1으로 리다이렉트
  if (state.curseIntroSeen) {
    showScreen('screen-mission1');
    renderMission1();
    return;
  }
  const container = document.getElementById('security-buttons');
  container.innerHTML = '';

  for (let n = 1; n <= 6; n++) {
    const btn = document.createElement('button');
    btn.className = 'sec-btn';
    btn.textContent = n;
    btn.dataset.num = n;
    if (state.securityCode.includes(n)) btn.classList.add('selected');
    btn.addEventListener('click', () => toggleSecCode(n));
    container.appendChild(btn);
  }

  renderSecSlots();
  updateSecBtn();

  document.getElementById('btn-security-reset').onclick = () => {
    // inventoryLocked 이후엔 초기화 불가 (이미 보안코드가 설정된 상태)
    if (state.inventoryLocked) return;
    state.securityCode = [];
    renderSecurityScreen();
  };

  document.getElementById('btn-security-back').onclick = () => {
    // inventoryLocked 이후엔 뒤로가기로 보안코드 재설정 불가
    if (state.inventoryLocked) {
      showScreen('screen-mission1');
      renderMission1();
      return;
    }
    showScreen('screen-inventory');
    renderInventory();
  };

  document.getElementById('btn-security-next').onclick = () => {
    if (state.securityCode.length !== 3) return;
    state.inventoryLocked = true;
    assignCurses();
    // 보안코드 설정 후 → 미션1 먼저
    showScreen('screen-mission1');
    renderMission1();
  };
}

function toggleSecCode(n) {
  if (state.securityCode.includes(n)) {
    state.securityCode = state.securityCode.filter(x => x !== n);
  } else {
    if (state.securityCode.length >= 3) return;
    state.securityCode.push(n);
  }
  renderSecurityScreen();
}

function renderSecSlots() {
  for (let i = 0; i < 3; i++) {
    const slot = document.getElementById(`sec-slot-${i}`);
    if (state.securityCode[i] !== undefined) {
      slot.textContent = state.securityCode[i];
      slot.classList.add('filled');
    } else {
      slot.textContent = '?';
      slot.classList.remove('filled');
    }
  }
}

function updateSecBtn() {
  const btnNext = document.getElementById('btn-security-next');
  btnNext.disabled = state.securityCode.length !== 3;

  // 버튼 상태 업데이트
  document.querySelectorAll('.sec-btn').forEach(btn => {
    const n = parseInt(btn.dataset.num);
    btn.classList.toggle('selected', state.securityCode.includes(n));
    btn.disabled = state.securityCode.length >= 3 && !state.securityCode.includes(n);
  });
}

/* ── 6. 저주 배정 ── */
function assignCurses() {
  const [a, b, c] = state.securityCode;
  const curseTypes = ['A', 'B', 'C'];
  const ranks = [a, b, c];

  state.curses = ranks.map((rank, idx) => {
    const curseType = curseTypes[idx];
    const invItem = state.inventory.find(i => i.rank === rank);

    let affectedRank = null;
    let affectedItemName = null;
    let curseAOnFirst = false;

    if (curseType === 'A') {
      if (a === 1) {
        // 특수 처리: 1순위에 저주A → 2순위 효과 약화
        curseAOnFirst = true;
        affectedRank = 2;
        affectedItemName = state.inventory.find(i => i.rank === 2)?.name;
      } else {
        affectedRank = 1;
        affectedItemName = state.inventory.find(i => i.rank === 1)?.name;
      }
    }

    return {
      rank,
      itemCode: invItem?.code,
      itemName: invItem?.name,
      curseType,
      affectedRank,
      affectedItemName,
      curseAOnFirst
    };
  });
}

/* ── 7. 저주 인트로 ── */
function renderCurseIntro() {
  state.curseIntroSeen = true;
  const display = document.getElementById('curse-code-display');
  display.textContent = state.securityCode.join(' — ');

  document.getElementById('btn-curse-proceed').onclick = () => {
    showScreen('screen-mission2');
    renderMission2();
  };
}

/* ── 8. 미션1 ── */
function renderMission1() {
  state.mission1Visited = true;
  const container = document.getElementById('mission1-questions');
  container.innerHTML = '';

  for (let rank = 1; rank <= 3; rank++) {
    const invItem = state.inventory.find(i => i.rank === rank);
    if (!invItem) continue;
    const key = `q${rank}`;
    const block = document.createElement('div');
    block.className = 'mission-item-block';
    block.innerHTML = `
      <div class="mission-item-header">
        <span class="mission-rank-badge">${rank}순위</span>
        <div>
          <div class="mission-item-name">${invItem.name}</div>
          <div class="mission-item-concept">${invItem.concept}</div>
        </div>
      </div>
      <div class="textarea-wrap">
        <textarea id="m1-${key}" rows="6" placeholder="행복의 의미/기준 개념을 활용하여 설명하고, 이 아이템이 작동하는 하루를 묘사하세요...">${state.mission1[key].response}</textarea>
        <div class="char-counter"><span id="m1-${key}-count">${state.mission1[key].charCount}</span>자</div>
      </div>
    `;
    container.appendChild(block);

    const ta = block.querySelector(`#m1-${key}`);
    ta.addEventListener('input', () => {
      state.mission1[key].response = ta.value;
      state.mission1[key].charCount = ta.value.length;
      block.querySelector(`#m1-${key}-count`).textContent = ta.value.length;
    });
  }

  document.getElementById('btn-m1-back').onclick = () => {
    showScreen('screen-inventory');
    renderInventory();
  };
  document.getElementById('btn-m1-next').onclick = () => {
    // 미션1 완료 후 → 저주 인트로 → 미션2
    showScreen('screen-curse-intro');
    renderCurseIntro();
  };
}

/* ── 9. 미션2 ── */
function renderMission2() {
  const container = document.getElementById('mission2-questions');
  container.innerHTML = '';

  const notSelected = getNotSelectedItems();
  const curseLabels = { A: '저주A', B: '저주B', C: '저주C' };

  state.curses.forEach((curse, idx) => {
    const key = `curse${idx + 1}`;
    const m2data = state.mission2[key];
    const curseType = curse.curseType;

    // 저주 내용 생성
    let curseContent = '';
    if (curseType === 'A') {
      curseContent = CURSES.A.template(curse.affectedRank, curse.affectedItemName, curse.curseAOnFirst);
    } else if (curseType === 'B') {
      curseContent = CURSES.B.template();
    } else {
      curseContent = CURSES.C.template();
    }

    // 감수 선택지 힌트
    const acceptHint = curseType === 'A'
      ? `저주에도 불구하고 왜 포기할 수 없는지 — 그리고 ${curse.curseAOnFirst ? '2순위' : '1순위'} 아이템(${curse.affectedItemName})의 효과가 점점 약해지는 상황을 어떻게 받아들일지`
      : '저주에도 불구하고 왜 포기할 수 없는지';

    const block = document.createElement('div');
    block.className = 'curse-block';
    block.innerHTML = `
      <div class="curse-block-header">
        <span class="curse-type-badge">${curseLabels[curseType]}</span>
        <span class="curse-item-name">${curse.itemName}</span>
        <span class="curse-rank-badge">${curse.rank}순위</span>
      </div>
      <div class="curse-content-box">${curseContent}</div>
      <p style="font-size:13px;font-weight:700;margin-bottom:10px;">이 상태에서 당신은 어떻게 하겠습니까? 하나를 선택하고 이유를 쓰세요. <span style="color:var(--color-primary)">(행복의 의미 또는 조건 개념 1개 이상 활용)</span></p>
      <div class="curse-choice-area" id="${key}-choices">
        <label id="${key}-label-accept" class="${m2data.choice === '감수' ? 'selected' : ''}">
          <input type="radio" name="${key}-choice" value="감수" ${m2data.choice === '감수' ? 'checked' : ''} />
          ☐ 저주를 감수하고 그대로 쓴다 — ${acceptHint}
        </label>
        <label id="${key}-label-replace" class="${m2data.choice === '교체' ? 'selected' : ''}">
          <input type="radio" name="${key}-choice" value="교체" ${m2data.choice === '교체' ? 'checked' : ''} />
          ☐ 이 아이템을 버리고, 자판기에 남겨뒀던 4개 중 1개를 새로 가져온다 — 뭘 가져오는지, 왜 그것인지
        </label>
      </div>
      <div class="replace-item-selector ${m2data.choice === '교체' ? 'visible' : ''}" id="${key}-replace-selector">
        <label>자판기에서 가져올 아이템:</label>
        <select class="replace-select" id="${key}-replace-item">
          <option value="">선택하세요</option>
          ${notSelected.map(item => `<option value="${item.code}" ${m2data.newItemCode === item.code ? 'selected' : ''}>${item.name} (${item.concept})</option>`).join('')}
        </select>
      </div>
      <div class="textarea-wrap" style="margin-top:14px;">
        <textarea id="${key}-response" rows="6" placeholder="선택 이유와 행복 개념을 활용한 서술을 작성하세요...">${m2data.response}</textarea>
        <div class="char-counter"><span id="${key}-count">${m2data.charCount}</span>자</div>
      </div>
    `;
    container.appendChild(block);

    // 라디오 이벤트
    const radios = block.querySelectorAll(`input[name="${key}-choice"]`);
    const replaceSelector = block.querySelector(`#${key}-replace-selector`);
    const labelAccept = block.querySelector(`#${key}-label-accept`);
    const labelReplace = block.querySelector(`#${key}-label-replace`);

    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        m2data.choice = radio.value;
        replaceSelector.classList.toggle('visible', radio.value === '교체');
        labelAccept.classList.toggle('selected', radio.value === '감수');
        labelReplace.classList.toggle('selected', radio.value === '교체');
        if (radio.value !== '교체') m2data.newItemCode = '';
      });
    });

    const replaceSelect = block.querySelector(`#${key}-replace-item`);
    replaceSelect.addEventListener('change', () => {
      m2data.newItemCode = replaceSelect.value;
    });

    const ta = block.querySelector(`#${key}-response`);
    ta.addEventListener('input', () => {
      m2data.response = ta.value;
      m2data.charCount = ta.value.length;
      block.querySelector(`#${key}-count`).textContent = ta.value.length;
    });
  });

  document.getElementById('btn-m2-back').onclick = () => {
    showScreen('screen-mission1');
    renderMission1();
  };
  document.getElementById('btn-m2-next').onclick = () => {
    // 교체 선택했는데 아이템 미선택 시 경고
    for (let idx = 0; idx < 3; idx++) {
      const key = `curse${idx + 1}`;
      const data = state.mission2[key];
      if (data.choice === '교체' && !data.newItemCode) {
        alert(`저주 ${idx + 1}번: 교체할 아이템을 선택해주세요.`);
        return;
      }
    }
    showScreen('screen-mission3');
    renderMission3();
  };
}

/* ── 10. 미션3 ── */
function renderMission3() {
  const sel1 = document.getElementById('craft-item1');
  const sel2 = document.getElementById('craft-item2');

  sel1.innerHTML = '<option value="">선택하세요</option>';
  sel2.innerHTML = '<option value="">선택하세요</option>';

  state.inventory.forEach(inv => {
    const item = getItemByCode(inv.code);
    const opt1 = new Option(`${inv.rank}순위: ${item.name}`, inv.code);
    const opt2 = new Option(`${inv.rank}순위: ${item.name}`, inv.code);
    sel1.appendChild(opt1);
    sel2.appendChild(opt2);
  });

  sel1.value = state.mission3.item1Code;
  sel2.value = state.mission3.item2Code;

  sel1.onchange = () => { state.mission3.item1Code = sel1.value; };
  sel2.onchange = () => { state.mission3.item2Code = sel2.value; };

  const nameInput = document.getElementById('craft-new-name');
  const descInput = document.getElementById('craft-new-desc');
  const happinessTA = document.getElementById('craft-happiness');

  nameInput.value = state.mission3.newItemName;
  descInput.value = state.mission3.newItemDesc;
  happinessTA.value = state.mission3.happinessResponse;

  nameInput.oninput = () => { state.mission3.newItemName = nameInput.value; };
  descInput.oninput = () => {
    state.mission3.newItemDesc = descInput.value;
    document.getElementById('craft-desc-count').textContent = descInput.value.length;
  };
  happinessTA.oninput = () => {
    state.mission3.happinessResponse = happinessTA.value;
    state.mission3.charCount = happinessTA.value.length;
    document.getElementById('craft-happiness-count').textContent = happinessTA.value.length;
  };

  // 초기 카운터
  document.getElementById('craft-desc-count').textContent = descInput.value.length;
  document.getElementById('craft-happiness-count').textContent = happinessTA.value.length;

  document.getElementById('btn-m3-back').onclick = () => {
    showScreen('screen-mission2');
    renderMission2();
  };
  document.getElementById('btn-m3-next').onclick = () => {
    showScreen('screen-submit');
    renderSubmitPreview();
  };
}

/* ── 11. 제출 확인 ── */
function renderSubmitPreview() {
  const preview = document.getElementById('submit-preview');
  preview.innerHTML = '';

  // 기본 정보
  let html = `
    <div class="preview-section">
      <div class="preview-section-title">[ 기본 정보 ]</div>
      <div class="preview-row"><span class="preview-label">학번:</span> ${state.studentId}</div>
      <div class="preview-row"><span class="preview-label">이름:</span> ${state.studentName}</div>
      <div class="preview-row"><span class="preview-label">보안코드:</span> ${state.securityCode.join('-')}</div>
    </div>
    <div class="preview-section">
      <div class="preview-section-title">[ 인벤토리 ]</div>
      ${state.inventory.map(inv => `<div class="preview-row">${inv.rank}순위: ${inv.name} (${inv.concept})</div>`).join('')}
      <div class="preview-row" style="margin-top:6px;"><span class="preview-label">미선택:</span> ${getNotSelectedItems().map(i => i.name).join(', ')}</div>
    </div>
    <div class="preview-section">
      <div class="preview-section-title">[ MISSION 1 — 나의 행복 스캔 ]</div>
      ${[1,2,3].map(rank => {
        const inv = state.inventory.find(i => i.rank === rank);
        const key = `q${rank}`;
        const data = state.mission1[key];
        return `<div class="preview-row"><span class="preview-label">(${rank}) ${rank}순위: ${inv?.name}</span> <span style="color:var(--text-sub);font-size:12px">${data.charCount}자</span></div>
        <div class="preview-response">${data.response || '(미작성)'}</div>`;
      }).join('')}
    </div>
    <div class="preview-section">
      <div class="preview-section-title">[ MISSION 2 — 저주 이벤트 ]</div>
      ${state.curses.map((curse, idx) => {
        const key = `curse${idx + 1}`;
        const data = state.mission2[key];
        const replaceItem = data.newItemCode ? getItemByCode(data.newItemCode)?.name : '';
        return `<div class="preview-row"><span class="preview-label">(${idx+1}) 저주${curse.curseType} → ${curse.rank}순위: ${curse.itemName}</span></div>
        <div class="preview-row">선택: ${data.choice || '(미선택)'}${replaceItem ? ` → ${replaceItem}` : ''} <span style="color:var(--text-sub);font-size:12px">${data.charCount}자</span></div>
        <div class="preview-response">${data.response || '(미작성)'}</div>`;
      }).join('')}
    </div>
    <div class="preview-section">
      <div class="preview-section-title">[ MISSION 3 — 아이템 크래프팅 ]</div>
      <div class="preview-row"><span class="preview-label">조합:</span> ${state.mission3.item1Code ? getItemByCode(state.mission3.item1Code)?.name : '(미선택)'} + ${state.mission3.item2Code ? getItemByCode(state.mission3.item2Code)?.name : '(미선택)'}</div>
      <div class="preview-row"><span class="preview-label">새 아이템:</span> ${state.mission3.newItemName || '(미입력)'}</div>
      <div class="preview-row"><span class="preview-label">설명:</span> ${state.mission3.newItemDesc || '(미입력)'}</div>
      <div class="preview-row"><span class="preview-label">행복 서술 (${state.mission3.charCount}자):</span></div>
      <div class="preview-response">${state.mission3.happinessResponse || '(미작성)'}</div>
    </div>
  `;
  preview.innerHTML = html;

  document.getElementById('btn-submit-back').onclick = () => {
    showScreen('screen-mission3');
    renderMission3();
  };

  const statusEl = document.getElementById('submit-status');
  statusEl.textContent = '';
  statusEl.className = 'submit-status';

  document.getElementById('btn-submit-final').onclick = () => {
    submitData();
  };

  // 제출 완료 후 재제출 방지
  if (state.submitted) {
    const submitBtn = document.getElementById('btn-submit-final');
    submitBtn.disabled = true;
    submitBtn.textContent = '이미 제출됨';
    document.getElementById('submit-status').textContent = '✅ 이미 제출이 완료되었습니다.';
    document.getElementById('submit-status').className = 'submit-status success';
  }

  document.getElementById('btn-download-pdf').onclick = () => {
    downloadPDF();
  };
}

/* ── 12. 네비게이션 ── */
function initNavBar() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (!state.inventoryLocked) return;

      if (target === 'screen-inventory') {
        showScreen('screen-inventory');
        renderInventory();
      } else if (target === 'screen-mission1') {
        showScreen('screen-mission1');
        renderMission1();
      } else if (target === 'screen-mission2') {
        // 미션1 방문 전에는 미션2 접근 불가
        if (!state.mission1Visited) {
          alert('미션1을 먼저 진행해주세요!');
          return;
        }
        // 네비로 미션2 접근 시에도 저주 인트로 본 것으로 처리 → 보안코드 잠금
        state.curseIntroSeen = true;
        showScreen('screen-mission2');
        renderMission2();
      } else if (target === 'screen-mission3') {
        showScreen('screen-mission3');
        renderMission3();
      } else if (target === 'screen-submit') {
        showScreen('screen-submit');
        renderSubmitPreview();
      }
    });
  });
}

/* ── 초기화 ── */
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initItemSelection();
  initNavBar();
  showScreen('screen-login');
});
