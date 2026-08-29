// callback function for image loaded increments count and check the count for ending 
// loading time
let imageLoaded = function () {
    imagesLoaded++;
    if (typeof reportInstantProgress === "function") {
        reportInstantProgress();
    }
    checkImagesLoadedCount();
}

// can set the game to not auto play with characters if you want all players to play
function setHumanPlayers(allHuman) {
    if (allHuman) {
        player1isPC = false;
        player2isPC = false;
        player3isPC = false;
        player4isPC = false;
    }
}

// can set up the canvas to accept mouse events
function setupCanvas(document) {
    canvas = document.getElementById('canvasId');
    context = canvas.getContext('2d');
    context.font = "20px CustomFont";
    canvas.font = "20px CustomFont";

    // define canvas listeners for mouse interaction on the canvas
    canvas.addEventListener("mousedown", doMouseDown, false);
    canvas.addEventListener("mouseup", doMouseUp, false);
    canvas.addEventListener("mousemove", doMouseMove, false);
    canvas.addEventListener("mouseout", doMouseOut, false);
    canvas.addEventListener("touchstart", doTouchStart, { passive: false });
    canvas.addEventListener("touchend", doTouchEnd, { passive: false });
    canvas.addEventListener("touchcancel", doTouchEnd, { passive: false });
}

// use of jquery to setup divs and set loading for image sources
function setupDivs() {
    loadingDiv = $("#loadingDiv");
    jTutorialDiv = $("#tutorialDiv");
}

// add event listeners to window for keydown and keyup
function setupWindow() {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

// mobile website buttons are different than the regular web buttons
function setupMobileButtons() {
    let playerCardOneButton = $("#playerCardOneButton")[0];
    if (playerCardOneButton != null) {
        playerCardOneButton.addEventListener("click", function () {
            playerCardPress(0);
        });
    }

    let playerCardTwoButton = $("#playerCardTwoButton")[0];
    if (playerCardTwoButton != null) {
        playerCardTwoButton.addEventListener("click", function () {
            playerCardPress(1);
        });
    }

    let playerCardThreeButton = $("#playerCardThreeButton")[0];
    if (playerCardThreeButton != null) {
        playerCardThreeButton.addEventListener("click", function () {
            playerCardPress(2);
        });
    }

    let playerCardFourButton = $("#playerCardFourButton")[0];
    if (playerCardFourButton != null) {
        playerCardFourButton.addEventListener("click", function () {
            playerCardPress(3);
        });
    }

    let playerCardFiveButton = $("#playerCardFiveButton")[0];
    if (playerCardFiveButton != null) {
        playerCardFiveButton.addEventListener("click", function () {
            playerCardPress(4);
        });
    }

    let playerCardSixButton = $("#playerCardSixButton")[0];
    if (playerCardSixButton != null) {
        playerCardSixButton.addEventListener("click", function () {
            playerCardPress(5);
        });
    }

    let playerCardSevenButton = $("#playerCardSevenButton")[0];
    if (playerCardSevenButton != null) {
        playerCardSevenButton.addEventListener("click", function () {
            playerCardPress(6);
        });
    }
}

// set up for empty cards to be played
function setupSlotButtons() {
    let slotOneButton = $("#slotOneButton")[0];
    if (slotOneButton != null) {
        slotOneButton.addEventListener("click", function () {
            placeHolderPress(0);
        });
    }

    let slotTwoButton = $("#slotTwoButton")[0];
    if (slotTwoButton != null) {
        slotTwoButton.addEventListener("click", function () {
            placeHolderPress(1);
        });
    }

    let slotThreeButton = $("#slotThreeButton")[0];
    if (slotThreeButton != null) {
        slotThreeButton.addEventListener("click", function () {
            placeHolderPress(2);
        });
    }

    let slotFourButton = $("#slotFourButton")[0];
    if (slotFourButton != null) {
        slotFourButton.addEventListener("click", function () {
            placeHolderPress(3);
        });
    }

    let slotFiveButton = $("#slotFiveButton")[0];
    if (slotFiveButton != null) {
        slotFiveButton.addEventListener("click", function () {
            placeHolderPress(4);
        });
    }

    let slotSixButton = $("#slotSixButton")[0];
    if (slotSixButton != null) {
        slotSixButton.addEventListener("click", function () {
            placeHolderPress(5);
        });
    }

    let slotSevenButton = $("#slotSevenButton")[0];
    if (slotSevenButton != null) {
        slotSevenButton.addEventListener("click", function () {
            placeHolderPress(6);
        });
    }
}

// set up for window control elements
function setupControls() {
    tutorialDiv = jTutorialDiv[0];
    tutorialDiv.addEventListener('click', function (e) {
        hideTutorial();
    });

    draggableControlsTextArea = $(".draggableControlsTextArea");
    $(function () {
        /* overlays are not draggable */
    });

    controlText = $("#controlText");
    controlText[0].innerHTML = ruleLog;

    draggableScoreDiv = $(".draggableScoreDiv");
    $(function () {
        /* overlays are not draggable */
    });

    scoreText = $("#scoreText")[0];
    activityLog = $("#activity")[0];

    bindOverlayClickToDismiss("draggableControlsTextArea");
    bindOverlayClickToDismiss("draggableScoreDiv");

    newGameButton = $("#newGameButton")[0];
    let overlayNewGameButton = document.getElementById("overlayNewGameButton");
    if (overlayNewGameButton) {
        overlayNewGameButton.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (gameOver) {
                newGameClicked();
            }
        });
    }
    newGameButton.addEventListener("click", function () {
        if (overlayDismissJustHappened()) {
            return;
        }
        if (isPlayerTurn() || gameOver) {
            newGameClicked();
        }
    });

    endTurnButton = $("#endTurnButton")[0];
    endTurnButton.addEventListener("click", function () {
        if (overlayDismissJustHappened()) {
            return;
        }
        if (gameReady && isPlayerTurn()) {
            endTurnClicked();
        }
    });

    musicButton = $("#musicButton")[0];
    musicButton.addEventListener("click", function () {
        musicButtonClicked();
    });

    scoreButton = $("#scoreButton");
    scoreButton[0].addEventListener("click", function () {
        if (gameReady && isPlayerTurn()) {
            scoreButtonClicked();
        }
    });

    controlsButton = $("#controlsButton")[0];
    controlsButton.addEventListener("click", function () {
        if (gameReady && isPlayerTurn()) {
            controlsButtonClicked();
        }
    });

    backImage.onload = imageLoaded;
    backImage.onerror = imageLoaded;
    backImage.src = "assets/images/back1.png";
}

// Load the board. Instant Games keeps Facebook's loader up until
// startGameAsync; checkImagesLoadedCount waits for that before revealing.
function init(document) {
    setupCanvas(document);
    setupDivs();
    setupWindow();
    setupMobileButtons();

    setupSlotButtons();
    setupControls();

    setHumanPlayers(false);

    // screen resize offset adjustment
    fitBoard();

    setDebugFlags(false);

    newGameClicked();
}

// clear canvas for fresh redraw on action
function clearCanvas() {
    context.save();

    // Use the identity matrix while clearing the canvas
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Restore the transform
    context.restore();
}

function leftArrowListener() {
    playercardPressed = -1;
    placeholderPressed = -1;

    if (topCardSelected === false) {

        // move cursor of player cards
        if (arrowPlayerCardSelected === -1) {

            //select first player card not null
            if (getPlayerCards().length > 0) {
                arrowPlayerCardSelected = 0;
            }
        } else {
            arrowPlayerCardSelected--;
            if (arrowPlayerCardSelected < 0) {
                arrowPlayerCardSelected = getPlayerCards().length - 1;
            }
        }
    } else {

        // move cursor of placeholder cards

        if (arrowPlaceholderCardSelected === -1) {
            arrowPlaceholderCardSelected = 0;
        } else {
            arrowPlaceholderCardSelected--;
            if (arrowPlaceholderCardSelected < 0) {
                arrowPlaceholderCardSelected = getMaxPlaceHolderCards() - 1;
            }
        }
    }

    drawBoard();
}

function upArrowListener() {
    playercardPressed = -1;
    placeholderPressed = -1;

    topCardSelected = false;

    if (arrowPlayerCardSelected === -1) {
        arrowPlayerCardSelected = 0;
    }

    drawBoard();
}

function downArrowListener() {
    playercardPressed = -1;
    placeholderPressed = -1;

    topCardSelected = true;

    //if no placeholder card is pressed select card 0
    if (arrowPlaceholderCardSelected === -1) {
        arrowPlaceholderCardSelected = 0;
    }

    drawBoard();
}

function rightArrowListener() {
    playercardPressed = -1;
    placeholderPressed = -1;

    if (topCardSelected === false) {

        //move cursor of player cards
        if (arrowPlayerCardSelected === -1) {

            //select first player card not null
            if (getPlayerCards().length > 0) {
                arrowPlayerCardSelected = 0;
            }
        } else {
            arrowPlayerCardSelected++;
            if (arrowPlayerCardSelected > getPlayerCards().length - 1) {
                arrowPlayerCardSelected = 0;
            }
        }
    } else {

        //move cursor of placeholder cards
        if (arrowPlaceholderCardSelected === -1) {
            arrowPlaceholderCardSelected = 0;
        } else {
            arrowPlaceholderCardSelected++;
            if (arrowPlaceholderCardSelected > getMaxPlaceHolderCards() - 1) {
                arrowPlaceholderCardSelected = 0;
            }
        }
    }

    drawBoard();
}

function controlListener() {
    playercardPressed = -1;
    placeholderPressed = -1;

    // perform card swap
    if (arrowPlayerCardSelected !== -1 && arrowPlaceholderCardSelected !== -1) {
        playercardPressed = arrowPlayerCardSelected;
        placeholderPressed = arrowPlaceholderCardSelected;

        moveCardFromKeyPress();

        arrowPlayerCardSelected = -1;
        arrowPlaceholderCardSelected = -1;
    }

    drawBoard();
}

function controlsButtonClicked() {
    setOverlayOpen("draggableScoreDiv", false);
    toggleOverlay("draggableControlsTextArea");
    if (isOverlayOpen("draggableControlsTextArea")) {
        $("#controlText").focus();
    }
}

function scoreButtonClicked() {
    if (gameOver && isOverlayOpen("draggableScoreDiv")) {
        return;
    }
    setOverlayOpen("draggableControlsTextArea", false);
    toggleOverlay("draggableScoreDiv");
}

function musicButtonClicked() {
    loadDeferredMusic();
    let audio = document.getElementById("audio");
    if (!audio) {
        return;
    }
    if (audio.paused) {
        let playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () { });
        }
    } else {
        audio.pause();
    }
}

let loadingRevealStarted = false;

function showBoardAfterScale() {
    let page = document.getElementById("pageDiv");
    if (page) {
        page.classList.add("is-ready");
        page.style.display = "flex";
    }
    if (loadingDiv) {
        loadingDiv.addClass("is-hidden");
    }
    if (typeof loadDeferredAssets === "function") {
        loadDeferredAssets();
    }
}

function revealLoadedBoard() {
    if (typeof fitBoard === "function") {
        fitBoard();
    }
    if (typeof drawBoard === "function") {
        drawBoard();
    }
    requestAnimationFrame(function () {
        if (typeof fitBoard === "function") {
            fitBoard();
        }
        requestAnimationFrame(showBoardAfterScale);
    });
}

function checkImagesLoadedCount() {
    if (imagesLoaded >= IMAGES_TO_LOAD && !loadingRevealStarted) {
        loadingRevealStarted = true;
        if (typeof onInstantAssetsReady === "function") {
            onInstantAssetsReady(revealLoadedBoard);
        } else {
            revealLoadedBoard();
        }
    }
}

function hideTutorial() {
    if (loadingDiv && loadingDiv.is(":visible") && !loadingDiv.hasClass("is-hidden")) {
        return;
    }
    if (jTutorialDiv) {
        jTutorialDiv.stop(true, true);
        jTutorialDiv[0].style.display = "";
    }
    if (tutorialDiv) {
        tutorialDiv.hidden = true;
    }
    setOverlayOpen("tutorialDiv", false);
    gameReady = true;
    if (typeof fitBoard === "function") {
        fitBoard();
    }
    if (typeof drawBoard === "function") {
        drawBoard();
    }
    if (typeof focusEndTurnButtonAfterClick === "function") {
        focusEndTurnButtonAfterClick();
    }
}

