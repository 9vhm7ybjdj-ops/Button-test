// Read ?screen= from URL to resume last unit/face
const params = new URLSearchParams(location.search);
const startScreen = parseInt(params.get("screen"));
let currentScreen = !isNaN(startScreen) ? startScreen : 0;

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

function getSelectedStore() {
  return document.getElementById("store").value || "No Store Selected";
}

function renderScreen() {
  const c = document.getElementById("unitContainer");
  c.innerHTML = "";

  const u = Math.floor(currentScreen / 2) + 1;
  const f = currentScreen % 2 === 0 ? "front" : "back";
  const l = f === "front" ? "Front Face" : "Back Face";

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
  nextBtn.onclick = () => {
    if (currentScreen === 5) {
      const store = getSelectedStore();
      const data = encodeURIComponent(JSON.stringify({
        store,
        units,
        lastScreen: currentScreen
      }));
      window.location.href = `report.html?data=${data}`;
      return;
    }
    currentScreen++;
    renderScreen();
  };

  nav.append(backBtn, nextBtn);
  face.appendChild(nav);

  wrap.appendChild(face);
  c.appendChild(wrap);
}

renderScreen();
