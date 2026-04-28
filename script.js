window.onload = () => {
    const bar = document.getElementById("loadingBar");
    const loadingScreen = document.getElementById("loadingScreen");

    // Start bar animation
    setTimeout(() => {
        bar.style.width = "100%";
    }, 100);

    // Fade out after 3 seconds
    setTimeout(() => {
        loadingScreen.style.opacity = "0";
    }, 3000);

    // Remove loading screen and show app
    setTimeout(() => {
        loadingScreen.style.display = "none";
        document.getElementById("app").style.display = "block";
    }, 3500);
};

/* TEST ORDER */
const units = ["Left", "Middle", "Right"];
const faces = ["Front", "Back"]; // front-first

let currentUnit = 0;
let currentFace = 0;

document.getElementById("startTest").onclick = () => {
    document.getElementById("storeScreen").style.display = "none";
    loadTestScreen();
};

function loadTestScreen() {
    document.getElementById("testScreen").style.display = "block";
    document.getElementById("unitTitle").innerText = units[currentUnit];
    document.getElementById("faceTitle").innerText = faces[currentFace];
}

/* REPORT + NAVIGATION */
document.getElementById("backToTest").onclick = () => {
    document.getElementById("reportScreen").style.display = "none";
    document.getElementById("testScreen").style.display = "block";
};

document.getElementById("newTest").onclick = () => {
    location.reload();
};

/* PDF FIX */
document.getElementById("downloadPDF").onclick = () => {
    const report = document.getElementById("reportContent");

    html2canvas(report, {
        backgroundColor: "#111",
        useCORS: true,
        scale: 2
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "UHC_Report.png";
        link.href = canvas.toDataURL();
        link.click();
    });
};
