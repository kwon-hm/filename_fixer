// 파일 목록 저장
let files = [];

// DOM 요소들
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const convertBtn = document.getElementById("convertBtn");
const results = document.getElementById("results");

// 한글 자모 → 완성형 한글 변환
function composeHangul(filename) {
  // 초성, 중성, 종성 매핑 테이블
  const CHO = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  const JUNG = [
    "ㅏ",
    "ㅐ",
    "ㅑ",
    "ㅒ",
    "ㅓ",
    "ㅔ",
    "ㅕ",
    "ㅖ",
    "ㅗ",
    "ㅘ",
    "ㅙ",
    "ㅚ",
    "ㅛ",
    "ㅜ",
    "ㅝ",
    "ㅞ",
    "ㅟ",
    "ㅠ",
    "ㅡ",
    "ㅢ",
    "ㅣ",
  ];
  const JONG = [
    "",
    "ㄱ",
    "ㄲ",
    "ㄳ",
    "ㄴ",
    "ㄵ",
    "ㄶ",
    "ㄷ",
    "ㄹ",
    "ㄺ",
    "ㄻ",
    "ㄼ",
    "ㄽ",
    "ㄾ",
    "ㄿ",
    "ㅀ",
    "ㅁ",
    "ㅂ",
    "ㅄ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];

  let result = "";
  let i = 0;

  while (i < filename.length) {
    const char = filename[i];

    // 초성인지 확인
    const choIndex = CHO.indexOf(char);
    if (choIndex !== -1 && i + 1 < filename.length) {
      const nextChar = filename[i + 1];
      const jungIndex = JUNG.indexOf(nextChar);

      if (jungIndex !== -1) {
        // 초성 + 중성 발견
        let jongIndex = 0;

        // 종성 확인
        if (i + 2 < filename.length) {
          const jongChar = filename[i + 2];
          const tempJongIndex = JONG.indexOf(jongChar);

          // 다음 글자가 초성이 아닌 종성인지 확인
          if (tempJongIndex !== -1 && tempJongIndex > 0) {
            // 그 다음 글자가 중성이 아니면 종성으로 처리
            if (
              i + 3 >= filename.length ||
              JUNG.indexOf(filename[i + 3]) === -1
            ) {
              jongIndex = tempJongIndex;
              i++; // 종성 소비
            }
          }
        }

        // 완성형 한글 생성: 0xAC00 + (초성 × 21 × 28) + (중성 × 28) + 종성
        const code = 0xac00 + choIndex * 21 * 28 + jungIndex * 28 + jongIndex;
        result += String.fromCharCode(code);
        i += 2; // 초성 + 중성 소비
        continue;
      }
    }

    // 조합 불가능한 문자는 그대로 유지
    result += char;
    i++;
  }

  return result;
}

// NFD(분해된 한글)를 NFC(조합된 한글)로 변환
function normalizeKoreanFilename(filename) {
  // 1단계: 한글 자모 조합 (ㅈㅏ → 자)
  let result = composeHangul(filename);

  // 2단계: NFD → NFC 정규화
  result = result.normalize("NFC");

  return result;
}

// 파일명이 깨졌는지 확인
function isKoreanBroken(filename) {
  const restored = normalizeKoreanFilename(filename);
  return filename !== restored;
}

// 드롭존 클릭 이벤트
dropZone.addEventListener("click", () => {
  fileInput.click();
});

// 파일 선택 이벤트
fileInput.addEventListener("change", (e) => {
  handleFiles(e.target.files);
});

// 드래그 앤 드롭 이벤트
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  handleFiles(e.dataTransfer.files);
});

// 파일 처리
function handleFiles(fileList) {
  files = Array.from(fileList);
  displayFiles();
  convertBtn.disabled = files.length === 0;
  results.innerHTML = "";
}

// 파일 목록 표시
function displayFiles() {
  if (files.length === 0) {
    fileList.innerHTML = '<p class="no-files">파일이 선택되지 않았습니다</p>';
    return;
  }

  fileList.innerHTML = "<h3>선택된 파일</h3>";
  const ul = document.createElement("ul");

  files.forEach((file, index) => {
    const li = document.createElement("li");
    const isBroken = isKoreanBroken(file.name);

    li.innerHTML = `
      <div class="file-item">
        <span class="file-icon">${isBroken ? "⚠️" : "✅"}</span>
        <div class="file-info">
          <div class="file-name ${isBroken ? "broken" : ""}">${file.name}</div>
          ${
            isBroken
              ? `<div class="file-preview">✨ 복원 → ${normalizeKoreanFilename(
                  file.name
                )}</div>`
              : '<div class="file-status">이미 정상입니다</div>'
          }
        </div>
        <button class="remove-btn" data-index="${index}">✕</button>
      </div>
    `;

    ul.appendChild(li);
  });

  fileList.appendChild(ul);

  // 삭제 버튼 이벤트
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      files.splice(index, 1);
      displayFiles();
      convertBtn.disabled = files.length === 0;
    });
  });
}

// 변환 버튼 클릭
convertBtn.addEventListener("click", () => {
  restoreFilenames();
});

// 파일명 복원 및 다운로드
async function restoreFilenames() {
  results.innerHTML = "<h3>복원 결과</h3>";
  const resultList = document.createElement("ul");
  resultList.className = "result-list";

  for (const file of files) {
    const originalName = file.name;
    const restoredName = normalizeKoreanFilename(originalName);
    const isBroken = isKoreanBroken(originalName);

    const li = document.createElement("li");

    if (isBroken) {
      // 파일명이 깨진 경우 - 복원된 이름으로 다운로드
      try {
        // 복원된 파일명으로 Blob 생성
        const blob = new Blob([file], { type: file.type });
        const url = URL.createObjectURL(blob);

        // 다운로드 링크 생성
        const a = document.createElement("a");
        a.href = url;
        a.download = restoredName;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // URL 정리
        setTimeout(() => URL.revokeObjectURL(url), 100);

        li.innerHTML = `
          <span class="result-icon success">✓</span>
          <div class="result-info">
            <div class="result-original">${originalName}</div>
            <div class="result-arrow">↓</div>
            <div class="result-converted">${restoredName}</div>
          </div>
        `;
      } catch (error) {
        li.innerHTML = `
          <span class="result-icon error">✗</span>
          <div class="result-info">
            <div class="result-original">${originalName}</div>
            <div class="result-error">오류: ${error.message}</div>
          </div>
        `;
      }
    } else {
      // 파일명이 정상인 경우
      li.innerHTML = `
        <span class="result-icon skipped">○</span>
        <div class="result-info">
          <div class="result-original">${originalName}</div>
          <div class="result-status">복원 불필요 (정상)</div>
        </div>
      `;
    }

    resultList.appendChild(li);
  }

  results.appendChild(resultList);

  // 완료 메시지
  const completeMsg = document.createElement("div");
  completeMsg.className = "complete-message";
  completeMsg.textContent =
    "✅ 복원이 완료되었습니다! 다운로드 폴더를 확인하세요.";
  results.appendChild(completeMsg);
}
