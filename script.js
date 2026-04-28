/* ------------------------------
   iOS 100vh FIX
------------------------------ */
function updateVH() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
updateVH();
window.onload = updateVH;
window.addEventListener("resize", updateVH);

/* ------------------------------
   LOADING SCREEN
------------------------------ */
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

        setTimeout(() => {
          screen.remove();
          updateVH();
          renderScreen();
        }, 800);

      }, 300);
    }
  }, 100);
});

/* ------------------------------
   HELPERS
------------------------------ */
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

/* ------------------------------
   MAIN TESTING SCREENS
------------------------------ */
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
      if (row.some(v => v === "FAIL")) rowDiv.classList.add("rowFail");

      row.forEach((val, cIndex) => {
        const btn = el("div", "btn");
        const text = el("span", "statusText");

        if (val === "PASS") {
          btn.classList.add("pass");
          text.textContent = "PASS";
        } else if (val === "FAIL") {
          btn.classList.add("fail");
          text.textContent = "FAIL";
        } else {
          btn.classList.add("un");
          text.textContent = "- - -";
        }

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

/* ------------------------------
   REPORT GENERATION
------------------------------ */
function buildReport() {
  const full = document.getElementById("fullGridView");
  full.innerHTML = "";

  const storeName = getSelectedStore();
  const timestamp = new Date().toLocaleString();
  const qrURL = generateQR(window.location.href);

  document.getElementById("pdfStoreName").textContent = storeName;
  document.getElementById("pdfTimestamp").textContent = timestamp;
  document.getElementById("pdfQR").src = qrURL;

  document.getElementById("reportStore").textContent = storeName;
  document.getElementById("reportTime").textContent = timestamp;

  let totalFails = 0;

  [1, 2, 3].forEach(u => {
    const unit = units[u];
    const row = el("div", "unitRow");

    ["front", "back"].forEach(side => {
      const face = el("div", "reportFace");
      face.appendChild(el("div", "sectionHeader", `${unitNames[u]} — ${side === "front" ? "Front" : "Back"}`));

      unit[side].forEach(r => {
        const wrap = el("div", "gridRowWrapper");
        const inner = el("div", "gridRowInner");

        if (r.some(v => v === "FAIL")) {
          inner.classList.add("rowFail");
          totalFails++;
        }

        r.forEach(v => {
          const cell = el("div", "cell", v === "UN" ? "- - -" : v);
          inner.appendChild(cell);
        });

        wrap.appendChild(inner);
        face.appendChild(wrap);
      });

      row.appendChild(face);
    });

    full.appendChild(row);
  });

  document.getElementById("totalFailures").textContent = `Total Failures: ${totalFails}`;

  document.getElementById("pdfBtn").style.display = "block";
  document.getElementById("sharePdfBtn").style.display = "block";
}

/* ------------------------------
   QR CODE
------------------------------ */
function generateQR(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
}

/* ------------------------------
   REPORT PAGE BUTTONS
------------------------------ */
document.getElementById("backToTest").onclick = () => {
  currentScreen = 5;
  renderScreen();
};

document.getElementById("newTest").onclick = () => {
  currentScreen = 0;

  [1,2,3].forEach(u => {
    units[u].skip = false;
    units[u].front = makeFace();
    units[u].back = makeFace();
  });

  renderScreen();
};

/* ------------------------------
   PDF GENERATION (AUTO-DETECT)
------------------------------ */
async function generatePDF() {
  const report = document.getElementById("report");

  report.style.display = "block";
  await new Promise(r => setTimeout(r, 200));

  if (typeof html2canvas === "undefined" || typeof jspdf === "undefined") {
    alert("PDF engine not loaded");
    return;
  }

  const canvas = await html2canvas(report, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#000"
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jspdf.jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const imgWidth = pageWidth;
  const imgHeight = canvas.height * (imgWidth / canvas.width);

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save("UHC-Report.pdf");
}

async function sharePDF() {
  const report = document.getElementById("report");

  report.style.display = "block";
  await new Promise(r => setTimeout(r, 200));

  if (typeof html2canvas === "undefined" || typeof jspdf === "undefined") {
    alert("PDF engine not loaded");
    return;
  }

  const canvas = await html2canvas(report, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#000"
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jspdf.jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const imgWidth = pageWidth;
  const imgHeight = canvas.height * (imgWidth / canvas.width);

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  const blob = pdf.output("blob");

  if (navigator.share) {
    const file = new File([blob], "UHC-Report.pdf", { type: "application/pdf" });
    navigator.share({ files: [file] });
  } else {
    alert("Sharing not supported");
  }
}
