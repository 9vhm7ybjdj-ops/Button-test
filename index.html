// iOS 100vh fix
function updateVH() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
window.addEventListener('resize', updateVH);
updateVH();

/* LOADING BAR */
window.addEventListener("DOMContentLoaded", () => {
  const bar = document.getElementById("loadingBarInner");
  const percent = document.getElementById("loadingPercent");
  const screen = document.getElementById("loadingScreen");

  let p = 0;
  const interval = setInterval(() => {
    p += 2;
    if (p > 100) p = 100;
    bar.style.width = p + "%";
    percent.textContent = p + "%";

    if (p === 100) {
      clearInterval(interval);
      setTimeout(() => {
        screen.style.opacity = "0";
        setTimeout(() => screen.remove(), 800);
      }, 300);
    }
  }, 100);
});

/* HELPERS */
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

function makeFace() {
  return Array.from({ length: 6 }, () => ["UN", "UN", "UN"]);
}

const unitNames = {
  1: "Left UHC",
  2: "Middle UHC",
  3: "Right UHC"
};

const units = {
  1: { skip: false, front: makeFace(), back: makeFace() },
  2: { skip: false, front: makeFace(), back: makeFace() },
  3: { skip: false, front: makeFace(), back: makeFace() }
};

let currentScreen = 0;

function getSelectedStore() {
  return document.getElementById("store").value || "No Store Selected";
}

/* TESTING SCREENS */
function renderScreen() {
  const c = document.getElementById("unitContainer");
  const r = document.getElementById("report");
  const m = document.getElementById("mode");

  c.innerHTML = "";
  r.style.display = "none";
  document.getElementById("pdfBtn").style.display = "none";
  document.getElementById("sharePdfBtn").style.display = "none";

  if (currentScreen === 6) {
    buildReport();
    r.style.display = "block";
    return;
  }

  const u = Math.floor(currentScreen / 2) + 1;
  const f = currentScreen % 2 === 0 ? "front" : "back";
  const l = f === "front" ? "Front Face" : "Back Face";

  m.textContent = `Testing ${l} (${unitNames[u]})`;

  const unit = units[u];
  const wrap = el("div", "faceWrap");
  const face = el("div", "face");

  face.appendChild(el("h3", "", `${unitNames[u]} — ${l}`));

  if (unit.skip) {
    face.appendChild(el("div", "", "SKIPPED"));
  } else {
    unit[f].forEach((row, rIndex) => {
      const rowDiv = el("div", "row");
      const hasFail = row.some(v => v === "FAIL");
      if (hasFail) rowDiv.classList.add("rowFail");

      row.forEach((val, cIndex) => {
        const btn = el("div", "btn");
        const dot = el("span", "statusDot");
        const text = el("span", "statusText");

        if (val === "PASS") {
          dot.classList.add("dot-pass");
          text.classList.add("text-pass");
          text.textContent = "PASS";
        } else if (val === "FAIL") {
          dot.classList.add("dot-fail");
          text.classList.add("text-fail");
          text.textContent = "FAIL";
        } else {
          dot.classList.add("dot-un");
          text.classList.add("text-un");
          text.textContent = "UNTESTED";
        }

        btn.appendChild(dot);
        btn.appendChild(text);

        btn.onclick = () => {
          if (unit.skip) return;
          const now = units[u][f][rIndex][cIndex];
          units[u][f][rIndex][cIndex] =
            now === "UN" ? "PASS" : now === "PASS" ? "FAIL" : "UN";
          renderScreen();
        };

        rowDiv.appendChild(btn);
      });

      face.appendChild(rowDiv);
    });
  }

  const skipBox = el("div", "skipBox");
  const skipCheck = document.createElement("input");
  skipCheck.type = "checkbox";
  skipCheck.checked = unit.skip;
  skipCheck.onchange = () => {
    unit.skip = skipCheck.checked;
    if (unit.skip) {
      unit.front = makeFace();
      unit.back = makeFace();
    }
    renderScreen();
  };
  skipBox.appendChild(skipCheck);
  skipBox.append(" Skip entire unit");
  face.appendChild(skipBox);

  const nav = el("div", "navBtns");
  const backBtn = el("button", "", "Back");
  backBtn.disabled = currentScreen === 0;
  backBtn.onclick = () => { currentScreen--; renderScreen(); };

  const nextBtn = el("button", "", currentScreen === 5 ? "Finish" : "Next");
  nextBtn.onclick = () => { currentScreen++; renderScreen(); };

  nav.append(backBtn, nextBtn);
  face.appendChild(nav);

  wrap.appendChild(face);
  c.appendChild(wrap);
}

/* REPORT (CLASSIC STYLE, 6x3, ROW HIGHLIGHT) */
function buildReport() {
  const full = document.getElementById("fullGridView");
  full.innerHTML = "";

  const storeName = getSelectedStore();
  const timestamp = new Date().toLocaleString();
  const qrURL = generateQR(window.location.href);

  document.getElementById("pdfStoreName").textContent = storeName;
  document.getElementById("pdfTimestamp").textContent = timestamp;
  document.getElementById("pdfQR").src = qrURL;

  document.getElementById("reportStore").textContent = `Store: ${storeName}`;
  document.getElementById("reportTime").textContent = `Generated: ${timestamp}`;

  let totalFails = 0;

  for (let u = 1; u <= 3; u++) {
    const row = el("div", "unitRow");

    ["front", "back"].forEach(f => {
      const f2 = el("div", "reportFace");
      const label = f === "front" ? "Front Face" : "Back Face";
      f2.appendChild(el("div", "sectionHeader", `${unitNames[u]} — ${label}`));

      if (units[u].skip) {
        const skipped = el("div", "", "SKIPPED");
        skipped.style.textAlign = "center";
        skipped.style.padding = "20px 0";
        f2.appendChild(skipped);
      } else {
        units[u][f].forEach(rowData => {
          const w = el("div", "gridRowWrapper");
          const hasFail = rowData.some(v => v === "FAIL");
          const inner = el("div", "gridRowInner");
          if (hasFail) inner.classList.add("rowFail");

          rowData.forEach(v => {
            const c = el("div", "cell");
            const dot = el("span", "statusDot");
            const text = el("span", "statusText");

            if (v === "PASS") {
              dot.classList.add("dot-pass");
              text.classList.add("text-pass");
              text.textContent = "PASS";
            } else if (v === "FAIL") {
              dot.classList.add("dot-fail");
              text.classList.add("text-fail");
              text.textContent = "FAIL";
              totalFails++;
            } else {
              dot.classList.add("dot-un");
              text.classList.add("text-un");
              text.textContent = "UNTESTED";
            }

            c.appendChild(dot);
            c.appendChild(text);
            inner.appendChild(c);
          });

          w.appendChild(inner);
          f2.appendChild(w);
        });
      }

      row.appendChild(f2);
    });

    full.appendChild(row);
  }

  document.getElementById("totalFailures").textContent = `Total Failures: ${totalFails}`;
  document.getElementById("pdfBtn").style.display = "block";
  document.getElementById("sharePdfBtn").style.display = "block";
}

/* PDF + SHARE */
async function preparePDFClone() {
  const report = document.getElementById("report");
  const clone = report.cloneNode(true);
  clone.style.position = "absolute";
  clone.style.top = "-9999px";
  clone.style.left = "-9999px";
  document.body.appendChild(clone);
  return clone;
}

async function downloadPDF() {
  const clone = await preparePDFClone();

  const storeName = getSelectedStore().replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `${storeName || "Store"}_${new Date().toISOString().slice(0, 10)}_UHC_Report.pdf`;

  const opt = {
    margin: 0,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: "#111", useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  await html2pdf().set(opt).from(clone).save();
  clone.remove();
}

async function sharePDF() {
  const clone = await preparePDFClone();

  const storeName = getSelectedStore().replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `${storeName || "Store"}_${new Date().toISOString().slice(0, 10)}_UHC_Report.pdf`;

  const opt = {
    margin: 0,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: "#111", useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const pdfBlob = await html2pdf().set(opt).from(clone).output('blob');
  clone.remove();

  const file = new File([pdfBlob], filename, { type: "application/pdf" });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title: "UHC Button Test Report",
      text: "PDF Report",
      files: [file]
    });
  } else {
    alert("Sharing is not supported on this device or browser.");
  }
}

/* QR */
function generateQR(text) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`;
}

/* INIT */
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("pdfBtn").onclick = downloadPDF;
  document.getElementById("sharePdfBtn").onclick = sharePDF;
});

renderScreen();
