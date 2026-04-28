/* V1.1 LOADING SCREEN */
window.onload = () => {
    const bar = document.getElementById("loadingBar");
    const loadingScreen = document.getElementById("loadingScreen");

    setTimeout(() => { bar.style.width = "100%"; }, 100);
    setTimeout(() => { loadingScreen.style.opacity = "0"; }, 3000);
    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 3600);
};

/* TEST ORDER */
const units = ["Left", "Middle", "Right"];
const faces = ["Front", "Back"];

let currentUnit = 0;
let currentFace = 0;

let results = {
    Left: { Front: null, Back: null },
    Middle: { Front: null, Back: null },
    Right: { Front: null, Back: null }
};

document.getElementById("startTest").onclick = () => {
    document.getElementById("storeScreen").style.display = "none";
    loadTestScreen();
};

function loadTestScreen() {
    document.getElementById("testScreen").style.display = "block";
    document.getElementById("unitTitle").innerText = units[currentUnit];
    document.getElementById("faceTitle").innerText = faces[currentFace];
    resetCircles();
}

function resetCircles() {
    document.querySelectorAll(".circle").forEach(c => {
        c.classList.remove("pass", "fail");
    });
}

/* BUTTON LOGIC */
document.getElementById("passBtn").onclick = () => recordResult("PASS");
document.getElementById("failBtn").onclick = () => recordResult("FAIL");
document.getElementById("skipBtn").onclick = () => recordResult("SKIP");

function recordResult(value) {
    const unit = units[currentUnit];
    const face = faces[currentFace];

    results[unit][face] = value;

    if (value === "PASS") glow("pass");
    if (value === "FAIL") glow("fail");

    nextStep();
}

function glow(type) {
    document.querySelectorAll(".circle").forEach(c => {
        c.classList.add(type);
    });
}

function nextStep() {
    if (currentFace === 0) {
        currentFace = 1;
    } else {
        currentFace = 0;
        currentUnit++;
    }

    if (currentUnit >= units.length) {
        showReport();
        return;
    }

    loadTestScreen();
}

/* REPORT */
function showReport() {
    document.getElementById("testScreen").style.display = "none";
    document.getElementById("reportScreen").style.display = "block";

    const report = document.getElementById("reportContent");
    report.innerHTML = "";

    for (let u of units) {
        report.innerHTML += `
            <div class="reportRow">
                <strong>${u}</strong><br>
                Front: ${results[u].Front}<br>
                Back: ${results[u].Back}<br><br>
            </div>
        `;
    }
}

/* NAVIGATION */
document.getElementById("backToTest").onclick = () => {
    document.getElementById("reportScreen").style.display = "none";
    document.getElementById("testScreen").style.display = "block";
};

document.getElementById("newTest").onclick = () => {
    location.reload();
};

/* EXPORT */
document.getElementById("downloadPDF").onclick = () => {
    const report = document.getElementById("reportContent");

    html2canvas(report, {
        backgroundColor: "#111",
        scale: 2
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "UHC_Report.png";
        link.href = canvas.toDataURL();
        link.click();
    });
};
