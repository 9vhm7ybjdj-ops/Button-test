function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

// Read data from URL
const params = new URLSearchParams(location.search);
const raw = params.get("data");
const parsed = JSON.parse(decodeURIComponent(raw));

const storeName = parsed.store;
const units = parsed.units;
const lastScreen = parseInt(params.get("screen")) || 0;

// Insert store + time + title
document.getElementById("reportTime").textContent = new Date().toLocaleString();
document.getElementById("reportTitle").textContent =
  `UHC Button Test – ${storeName}`;

const full = document.getElementById("fullGridView");

const unitNames = {
  0: "Left UHC",
  1: "Middle UHC",
  2: "Right UHC"
};

// QR generator
function generateQR(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
}

// FAIL COUNTS
let frontFails = 0;
let backFails = 0;

// Render each unit (2×3 layout)
[0,1,2].forEach(u => {
  const unit = units[u];
  const row = el("div", "unitRow");

  ["front", "back"].forEach(side => {
    const face = el("div", "reportFace");

    face.appendChild(el("div", "sectionHeader",
      `${unitNames[u]} — ${side === "front" ? "Front" : "Back"}`));

    if (unit.skip) {
      const skippedBox = el("div", "", "SKIPPED");
      skippedBox.style.fontSize = "28px";
      skippedBox.style.textAlign = "center";
      skippedBox.style.padding = "40px 0";
      skippedBox.style.color = "#ffeb3b";
      skippedBox.style.textShadow = "0 0 12px #ffeb3b";
      face.appendChild(skippedBox);
      row.appendChild(face);
      return;
    }

    unit[side].forEach(r => {
      const wrap = el("div", "gridRowWrapper");
      const inner = el("div", "gridRowInner");

      if (r.some(v => v === "FAIL")) {
        inner.classList.add("rowFail");
        if (side === "front") frontFails++;
        else backFails++;
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

// Insert fail counts
document.getElementById("totalFailures").innerHTML =
  `<span style="color:#ff4444;">Front Fails: ${frontFails}</span> &nbsp;&nbsp; 
   <span style="color:#ff4444;">Back Fails: ${backFails}</span>`;

// BACK → return to last unit/face
document.getElementById("backToTest").onclick = () => {
  window.location.href = `app.html?screen=${lastScreen}`;
};

// NEW TEST → restart
document.getElementById("newTest").onclick = () => {
  window.location.href = "app.html";
};

// SHARE APP → generate QR code on page
document.getElementById("shareAppBtn").onclick = () => {
  const appURL = "https://9vhm7ybjdj-ops.github.io/Button-test/";
  const qrURL = generateQR(appURL);

  const img = document.getElementById("appQR");
  img.src = qrURL;
  img.style.display = "block";
};

// ⭐ FIXED SHARE PDF — waits for full render, then shares
async function sharePDF() {
  const report = document.querySelector(".report");

  // Wait for Safari/iOS to finish painting the DOM
  await new Promise(resolve => setTimeout(resolve, 500));

  const opt = {
    margin: 0,
    filename: `UHC-Report-${storeName}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 3, useCORS: true, backgroundColor: "#000" },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  // Generate PDF as Blob
  const pdfBlob = await html2pdf().set(opt).from(report).outputPdf("blob");

  const file = new File(
    [pdfBlob],
    `UHC-Report-${storeName}.pdf`,
    { type: "application/pdf" }
  );

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: "UHC Report",
      text: "UHC Button Test Report"
    });
  } else {
    alert("Sharing not supported on this device.");
  }
}

document.getElementById("sharePdfBtn").onclick = sharePDF;
