# 행복 인벤토리 — 설정 가이드

## 파일 구조

```
/
├── index.html       # 메인 HTML (SPA)
├── style.css        # 스타일시트
├── app.js           # 게임 로직 (화면 전환, 저주 배정 등)
├── submit.js        # 제출(Google Sheets) + PDF 생성
├── assets/
│   └── icons/       # 아이템 아이콘 이미지 (추후 배치)
└── README.md
```

---

## 1. GitHub Pages 배포

1. 이 폴더를 GitHub 레포지토리에 업로드
2. Settings → Pages → Branch: main / (root) → Save
3. 배포 URL 확인 후 학생에게 공유

---

## 2. Google Apps Script 설정

### 스프레드시트 생성
1. Google Sheets에서 새 스프레드시트 생성
2. 첫 번째 시트 이름을 **"요약"** 으로 변경

### Apps Script 설정
1. 스프레드시트 → 확장 프로그램 → Apps Script
2. `submit.js` 파일 하단의 주석 처리된 코드를 **그대로 복사** (주석 제거 후)
3. Apps Script 에디터에 붙여넣기
4. 저장 후 **배포 → 새 배포**
5. 유형: **웹 앱**
6. 실행: **나 (스크립트 소유자)**
7. 액세스: **모든 사용자** (학생 구글 로그인 불필요)
8. **배포 URL 복사**

### submit.js URL 연결
`submit.js` 상단의 다음 줄을 배포 URL로 교체:

```javascript
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
//                       ↑ 이 부분을 실제 URL로 교체
```

---

## 3. 아이템 아이콘 이미지 교체

이미지 파일을 `assets/icons/` 폴더에 저장:

| 파일명 | 아이템 |
|--------|--------|
| A.png  | 무한리필 통장 |
| B.png  | 히포크라테스의 빨간 약 |
| C.png  | 레벨업의 돋보기 |
| D.png  | 끊어지지 않는 실전화기 |
| E.png  | 파이브스타 달팽이 |
| F.png  | 만인의 확성기 |
| G.png  | 황금 티켓 뭉치 |
| H.png  | 거울 도끼 |
| I.png  | 스포트라이트 배지 |
| J.png  | 전설의 유리 거북이 |

이미지 적용은 `app.js`의 `getItemIconFull()` 함수에서 주석 처리된 코드를 활성화:

```javascript
// 현재 (이모지 모드):
return `<div class="item-icon">${item.icon}</div>`;

// 이미지 모드로 교체:
return `<div class="item-icon"><img src="${item.iconImg}" alt="${item.name}" onerror="this.parentNode.textContent='${item.icon}'"/></div>`;
```

---

## 4. PDF 한글 폰트 적용 (선택사항)

현재 PDF는 한글이 □ 로 표시됩니다.  
한글 폰트를 적용하려면:

1. NanumGothic 또는 Noto Sans KR woff2 파일을 Base64로 변환
2. `submit.js`에 jsPDF 폰트 등록 코드 추가:
   ```javascript
   doc.addFileToVFS('NanumGothic.ttf', [base64 문자열]);
   doc.addFont('NanumGothic.ttf', 'NanumGothic', 'normal');
   doc.setFont('NanumGothic');
   ```
3. `submit.js` 상단의 `const FONT_READY = false;` → `true` 로 변경

---

## 5. 진행 흐름 요약

```
학번/이름 입력
    ↓
튜토리얼 (타이핑 연출, 클릭으로 스킵 가능)
    ↓
아이템 선택 (10개 중 6개)
    ↓
인벤토리 구성 (드래그&드롭으로 1~6순위 배정)
    ↓
보안 코드 설정 (1~6 중 서로 다른 숫자 3개)
    ↓ ← 보안 코드 설정 후 인벤토리 순서 잠금
저주 이벤트 인트로 (⚡ 경고 연출)
    ↓
MISSION 1 — 나의 행복 스캔 (1~3순위 서술)
    ↓
MISSION 2 — 저주 이벤트 (저주 3개 대응)
    ↓
MISSION 3 — 아이템 크래프팅
    ↓
제출 확인 (미리보기)
    ↓
제출 (Google Sheets 전송) + PDF 저장 가능
    ↓
완료 화면
```

네비게이션 바(하단 고정)로 미션 간 자유 이동 가능 (보안 코드 설정 후)

---

## 6. 주요 구현 사항

- **아이패드 터치 드래그**: 커스텀 touch 이벤트 구현 (touchstart/move/end)
- **보안 코드 잠금**: 설정 후 인벤토리 순위 변경 불가
- **저주A 특수 처리**: 1순위에 저주A 배정 시 자동으로 2순위 약화로 변경
- **로컬 스토리지 미사용**: 모든 상태는 JS 변수로 관리
- **세션 내 입력 보존**: 화면 간 이동 시 서술 내용 유지
- **실시간 글자수 카운터**: 모든 서술 입력란에 적용
