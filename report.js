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
const lastScreen = parsed.lastScreen ?? 0;

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
  window.location.href = `app.html?screen=${lastScreen}`;
};

document.getElementById("newTest").onclick = () => {
  window.location.href = "app.html";
};
