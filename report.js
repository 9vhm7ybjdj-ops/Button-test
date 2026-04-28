function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

const params = new URLSearchParams(location.search);
const raw = params.get("data");
const parsed = JSON.parse(decodeURIComponent(raw));

const storeName = parsed.store;
const units = parsed.units;

document.getElementById("reportStore").textContent = storeName;
document.getElementById("reportTime").textContent = new Date().toLocaleString();
document.getElementById("reportTitle").textContent =
  `UHC Button Test – ${storeName}`;

const full = document.getElementById("fullGridView");
let totalFails = 0;

const unitNames = {
  1: "Left UHC",
  2: "Middle UHC",
  3: "Right UHC"
};

[1,2,3].forEach(u => {
  const unit = units[u];
  const row = el("div", "unitRow");

  ["front", "back"].forEach(side => {
    const face = el("div", "reportFace");
    face.appendChild(el("div", "sectionHeader",
      `${unitNames[u]} — ${side === "front" ? "Front" : "Back"}`));

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

document.getElementById("totalFailures").textContent =
  `Total Failures: ${totalFails}`;

document.getElementById("backToTest").onclick = () => {
  window.location.href = "index.html";
};

document.getElementById("newTest").onclick = () => {
  window.location.href = "index.html";
};

document.getElementById("shareAppBtn").onclick = () => {
  const appURL = "https://m7ybjdj-ops.github.io/";
  if (navigator.share) {
    navigator.share({
      title: "UHC Button Test App",
      text: "Open the UHC Button Test App.",
      url: appURL
    });
  } else {
    window.open(appURL, "_blank");
  }
};

document.getElementById("pdfBtn").onclick = async () => {
  const report = document.getElementById("report");

  await new Promise(r => requestAnimationFrame(r));
  await new Promise(r => requestAnimationFrame(r));
  await new Promise(r => setTimeout(r, 150));

  window.scrollTo(0, document.body.scrollHeight);
  await new Promise(r => setTimeout(r, 100));
  window.scrollTo(0, 0);

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
};

document.getElementById("sharePdfBtn").onclick = async () => {
  const report = document.getElementById("report");

  await new Promise(r => requestAnimationFrame(r));
  await new Promise(r => requestAnimationFrame(r));
  await new Promise(r => setTimeout(r, 150));

  window.scrollTo(0, document.body.scrollHeight);
  await new Promise(r => setTimeout(r, 100));
  window.scrollTo(0, 0);

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
};
