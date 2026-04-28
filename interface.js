function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

function makeFace() {
  return Array.from({ length: 6 }, () => ["UN", "UN", "UN"]);
}

const unitNames = [
  "Left UHC",
  "Middle UHC",
  "Right UHC"
];

const units = [
  { skip: false, front: makeFace(), back: makeFace() },
  { skip: false, front: makeFace(), back: makeFace() },
  { skip: false, front: makeFace(), back: makeFace() }
];

const params = new URLSearchParams(location.search);
const startScreen = parseInt(params.get("screen"));
let currentScreen = !isNaN(startScreen) ? startScreen : 0;

function getSelectedStore() {
  return document.getElementById("store").value || "No Store Selected";
}

function renderScreen() {
  const c = document.getElementById("unitContainer");
  c.innerHTML = "";

  const unitIndex = Math.floor(currentScreen / 2);
  const sideKey = currentScreen % 2 === 0 ? "front" : "back";
  const sideLabel = sideKey === "front" ? "Front Face" : "Back Face";

  const unit = units[unitIndex];

  const wrap = el("div", "faceWrap");
  const face = el("div", "face");

  face.appendChild(el("h3", "", `${unitNames[unitIndex]} — ${sideLabel}`));

  if (unit.skip) {
    const skipped = el("div", "", "SKIPPED");
    skipped.style.textAlign = "center";
    skipped.style.fontSize = "24px";
    skipped.style.padding = "40px 0";
    face.appendChild(skipped);
  } else {
    unit[sideKey].forEach((row, rIndex) => {
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

          const current = units[unitIndex][sideKey][rIndex][cIndex];
          const next =
            current === "UN" ? "PASS" :
            current === "PASS" ? "FAIL" :
            "UN";

          units[unitIndex][sideKey][rIndex][cIndex] = next;
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
  backBtn.onclick = () => {
    if (currentScreen > 0) {
      currentScreen--;
      renderScreen();
    }
  };

  const nextBtn = el("button", "",
    currentScreen === 5 ? "Finish" : "Next"
  );

  nextBtn.onclick = () => {
    if (currentScreen === 5) {
      const store = getSelectedStore();

      const data = encodeURIComponent(JSON.stringify({
        store,
        units,
        lastScreen: currentScreen
      }));

      window.location.href = `report.html?data=${data}&screen=${currentScreen}`;
    } else {
      currentScreen++;
      renderScreen();
    }
  };

  nav.append(backBtn, nextBtn);
  face.appendChild(nav);

  wrap.appendChild(face);
  c.appendChild(wrap);
}

renderScreen();
