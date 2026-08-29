const BOARD_WIDTH = 950;
const BOARD_HEIGHT = 580;

let boardScale = 1;
let touchInputActive = false;

function eventToBoardCoords(event) {
    let clientX;
    let clientY;
    if (event.changedTouches && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
    } else if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }

    if (!canvas) {
        mouseX = clientX - offsetX;
        mouseY = clientY - offsetY;
        return;
    }

    let rect = canvas.getBoundingClientRect();
    let displayW = rect.width || BOARD_WIDTH;
    let displayH = rect.height || BOARD_HEIGHT;
    mouseX = (clientX - rect.left) * (BOARD_WIDTH / displayW);
    mouseY = (clientY - rect.top) * (BOARD_HEIGHT / displayH);
    offsetX = rect.left;
    offsetY = rect.top;
    boardScale = displayW / BOARD_WIDTH;
}

function fitBoard() {
    let stage = document.getElementById("boardStage");
    let canvasEl = document.getElementById("canvasId");
    if (!stage || !canvasEl) {
        return;
    }

    let stageW = stage.clientWidth;
    let stageH = stage.clientHeight;
    if (stageW < 1 || stageH < 1) {
        return;
    }

    let scale = Math.min(stageW / BOARD_WIDTH, stageH / BOARD_HEIGHT);
    if (scale <= 0) {
        return;
    }

    boardScale = scale;
    canvasEl.style.width = Math.floor(BOARD_WIDTH * scale) + "px";
    canvasEl.style.height = Math.floor(BOARD_HEIGHT * scale) + "px";

    adjustOffset();
    if (typeof context !== "undefined" && context !== null && typeof drawBoard === "function") {
        drawBoard();
    }
}

function adjustOffset() {
    let canvasEl = document.getElementById("canvasId");
    if (!canvasEl) {
        return;
    }
    let rect = canvasEl.getBoundingClientRect();
    offsetX = Math.round(rect.left);
    offsetY = Math.round(rect.top);
    if (rect.width > 0) {
        boardScale = rect.width / BOARD_WIDTH;
    }
}

function isOverlayOpen(id) {
    let el = document.getElementById(id);
    return el !== null && el.classList.contains("is-open");
}

function setOverlayOpen(id, open) {
    let el = document.getElementById(id);
    if (!el) {
        return;
    }
    el.classList.toggle("is-open", open);
}

function toggleOverlay(id) {
    setOverlayOpen(id, !isOverlayOpen(id));
}

function closeGameOverlays() {
    setOverlayOpen("draggableControlsTextArea", false);
    setOverlayOpen("draggableScoreDiv", false);
}
