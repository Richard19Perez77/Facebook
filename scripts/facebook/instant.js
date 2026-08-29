// Instant Games lifecycle around init().
// Local file or a top-level localhost tab skips the SDK so debug still works.
// Facebook / the embedded player (iframe) uses initializeAsync → progress → startGameAsync.

let instantSdkReady = false;
let instantSdkPending = false;
let instantGameStarted = false;
let instantGameInited = false;
let instantImagesReady = false;
let instantFontReady = false;
let instantRevealBoard = null;
let instantBoardRevealed = false;
let instantStartTimer = null;
let musicWasPlaying = false;
let musicPolicyHooked = false;

const INSTANT_SDK_TIMEOUT_MS = 8000;
const INSTANT_ASSETS_TIMEOUT_MS = 8000;
const INSTANT_FONT_TIMEOUT_MS = 3000;

function hasFBInstantApi() {
    return typeof FBInstant !== "undefined"
        && FBInstant !== null
        && typeof FBInstant.initializeAsync === "function";
}

function isLocalFileOpen() {
    return window.location.protocol === "file:";
}

function isFacebookInstantHost() {
    let host = (window.location.hostname || "").toLowerCase();
    return host.indexOf("facebook.") !== -1
        || host.indexOf("fbcdn.") !== -1
        || host.indexOf("fbsbx.") !== -1
        || host === "fb.gg"
        || host.indexOf(".fb.com") !== -1
        || host.indexOf("messenger.com") !== -1;
}

function isEmbeddedInHostPage() {
    try {
        return window.parent !== window;
    } catch (e) {
        return true;
    }
}

// True inside Instant Games / Meta's embedded player. False when opening this folder in Chrome.
function shouldUseInstantSdk() {
    if (!hasFBInstantApi() || isLocalFileOpen()) {
        return false;
    }
    if (isFacebookInstantHost() || isEmbeddedInHostPage()) {
        return true;
    }
    return false;
}

function promiseWithTimeout(promise, ms, message) {
    return new Promise(function (resolve, reject) {
        let settled = false;
        let timer = setTimeout(function () {
            if (settled) {
                return;
            }
            settled = true;
            reject(new Error(message));
        }, ms);
        promise.then(function (value) {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(timer);
            resolve(value);
        }, function (err) {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(timer);
            reject(err);
        });
    });
}

function getMusicElement() {
    return document.getElementById("audio");
}

function isMusicMuted() {
    let audio = getMusicElement();
    if (!audio) {
        return true;
    }
    return audio.muted || audio.volume === 0;
}

function setupMusicPolicy() {
    let audio = getMusicElement();
    if (!audio || musicPolicyHooked) {
        return;
    }
    musicPolicyHooked = true;

    audio.addEventListener("play", function () {
        if (gamePaused || document.hidden) {
            audio.pause();
        }
    });
}

function pauseMusicForLifecycle() {
    let audio = getMusicElement();
    if (!audio) {
        return;
    }
    if (!audio.paused) {
        musicWasPlaying = true;
        audio.pause();
    }
}

function resumeMusicAfterLifecycle() {
    let audio = getMusicElement();
    if (!audio || gamePaused || document.hidden || isMusicMuted()) {
        return;
    }
    if (musicWasPlaying) {
        let playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () { });
        }
    }
}

function ensurePauseOverlay() {
    let overlay = document.getElementById("instantPauseOverlay");
    if (overlay) {
        return overlay;
    }
    overlay = document.createElement("div");
    overlay.id = "instantPauseOverlay";
    overlay.style.cssText = "display:none;position:fixed;inset:0;background:rgba(0,0,0,0.75);color:#fff;z-index:10000;align-items:center;justify-content:center;text-align:center;font-family:CustomFont,serif;";
    overlay.innerHTML = "<div><p>Paused</p><button type=\"button\" id=\"instantResumeButton\">Resume</button></div>";
    document.body.appendChild(overlay);
    document.getElementById("instantResumeButton").addEventListener("click", function () {
        resumeInstantGame();
    });
    return overlay;
}

function showPauseOverlay() {
    let overlay = ensurePauseOverlay();
    overlay.style.display = "flex";
}

function hidePauseOverlay() {
    let overlay = document.getElementById("instantPauseOverlay");
    if (overlay) {
        overlay.style.display = "none";
    }
}

function pauseInstantGame(showOverlay) {
    gamePaused = true;
    if (typeof pausePcTurnTimer === "function") {
        pausePcTurnTimer();
    }
    pauseMusicForLifecycle();
    if (showOverlay) {
        showPauseOverlay();
    }
}

function resumeInstantGame() {
    if (document.hidden) {
        return;
    }
    gamePaused = false;
    hidePauseOverlay();
    if (typeof resumePcTurnTimer === "function") {
        resumePcTurnTimer();
    }
    resumeMusicAfterLifecycle();
}

function reportInstantProgress() {
    if (!instantSdkReady || typeof FBInstant.setLoadingProgress !== "function") {
        return;
    }
    let loaded = typeof imagesLoaded === "number" ? imagesLoaded : 0;
    let need = typeof IMAGES_TO_LOAD === "number" && IMAGES_TO_LOAD > 0 ? IMAGES_TO_LOAD : 30;
    let imgPart = Math.min(loaded, need);
    let fontPart = instantFontReady ? 1 : 0;
    let pct = Math.round(100 * (imgPart + fontPart) / (need + 1));
    FBInstant.setLoadingProgress(Math.max(0, Math.min(99, pct)));
}

function markFontReady() {
    if (instantFontReady) {
        return;
    }
    instantFontReady = true;
    reportInstantProgress();
    tryStartInstantGame();
}

function loadGameFont() {
    if (!document.fonts || typeof document.fonts.load !== "function") {
        markFontReady();
        return;
    }
    let timer = setTimeout(markFontReady, INSTANT_FONT_TIMEOUT_MS);
    document.fonts.load("20px CustomFont").then(function () {
        clearTimeout(timer);
        markFontReady();
    }, function () {
        clearTimeout(timer);
        markFontReady();
    });
}

function revealBoardNow() {
    if (instantBoardRevealed) {
        return;
    }
    instantBoardRevealed = true;
    if (instantSdkReady) {
        loadCloudHighScore();
    }
    if (typeof instantRevealBoard === "function") {
        instantRevealBoard();
        return;
    }
    if (typeof revealLoadedBoard === "function") {
        revealLoadedBoard();
        return;
    }
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
        requestAnimationFrame(function () {
            let page = document.getElementById("pageDiv");
            if (page) {
                page.classList.add("is-ready");
                page.style.display = "flex";
            }
            if (typeof loadingDiv !== "undefined" && loadingDiv && loadingDiv.addClass) {
                loadingDiv.addClass("is-hidden");
            }
            loadDeferredAssets();
        });
    });
}

function tryStartInstantGame() {
    if (!instantImagesReady || !instantFontReady || instantSdkPending) {
        return;
    }
    if (instantGameStarted) {
        revealBoardNow();
        return;
    }
    instantGameStarted = true;
    if (instantStartTimer !== null) {
        clearTimeout(instantStartTimer);
        instantStartTimer = null;
    }

    if (!instantSdkReady) {
        revealBoardNow();
        return;
    }

    if (typeof FBInstant.setLoadingProgress === "function") {
        FBInstant.setLoadingProgress(100);
    }
    FBInstant.startGameAsync().then(function () {
        revealBoardNow();
    }).catch(function (err) {
        console.warn("FBInstant.startGameAsync failed", err);
        revealBoardNow();
    });
}

function onInstantAssetsReady(revealFn) {
    if (typeof revealFn === "function") {
        instantRevealBoard = revealFn;
    }
    instantImagesReady = true;
    reportInstantProgress();
    tryStartInstantGame();
}

function initGameOnce(doc) {
    if (instantGameInited) {
        return;
    }
    instantGameInited = true;
    init(doc);
}

function armAssetTimeout() {
    if (instantStartTimer !== null) {
        return;
    }
    instantStartTimer = setTimeout(function () {
        instantStartTimer = null;
        instantImagesReady = true;
        instantFontReady = true;
        tryStartInstantGame();
    }, INSTANT_ASSETS_TIMEOUT_MS);
}

function loadLocalHighScore() {
    try {
        if (typeof localStorage === "undefined") {
            return;
        }
        let raw = localStorage.getItem("scoreSave");
        if (!raw) {
            return;
        }
        let parsed = JSON.parse(raw);
        if (parsed != null && typeof parsed.highScore === "number") {
            highScore = parsed.highScore;
        }
    } catch (e) {
        // ignore
    }
}

function persistHighScore() {
    let payload = { highScore: highScore };
    try {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("scoreSave", JSON.stringify(payload));
        }
    } catch (e) {
        // ignore
    }
    if (instantSdkReady && FBInstant.player && typeof FBInstant.player.setDataAsync === "function") {
        FBInstant.player.setDataAsync({ highScore: highScore }).catch(function () { });
    }
}

function loadCloudHighScore() {
    if (!instantSdkReady || !FBInstant.player || typeof FBInstant.player.getDataAsync !== "function") {
        loadLocalHighScore();
        return;
    }
    FBInstant.player.getDataAsync(["highScore"]).then(function (data) {
        if (data && typeof data.highScore === "number") {
            highScore = data.highScore;
            return;
        }
        loadLocalHighScore();
    }).catch(function () {
        loadLocalHighScore();
    });
}

function loadDeferredMusic() {
    let audio = getMusicElement();
    if (!audio || audio.getAttribute("data-src-loaded") === "1") {
        return;
    }
    audio.setAttribute("data-src-loaded", "1");
    let source = document.createElement("source");
    source.src = "assets/music/track.mp3";
    source.type = "audio/mpeg";
    audio.appendChild(source);
    if (typeof audio.load === "function") {
        audio.load();
    }
}

function loadDeferredTutorial() {
    let tutorialImage = document.getElementById("tutorialImage");
    if (!tutorialImage || tutorialImage.getAttribute("data-src-loaded") === "1") {
        return;
    }
    tutorialImage.setAttribute("data-src-loaded", "1");
    let shown = false;
    function showTutorial() {
        if (shown) {
            return;
        }
        shown = true;
        setOverlayOpen("tutorialDiv", true);
        if (tutorialDiv) {
            tutorialDiv.hidden = false;
        }
    }
    tutorialImage.onload = showTutorial;
    tutorialImage.onerror = function () {
        if (typeof gameReady !== "undefined") {
            gameReady = true;
        }
    };
    tutorialImage.src = "assets/images/tutorial.png";
    setTimeout(function () {
        if (!shown && tutorialImage.naturalWidth === 0) {
            if (typeof gameReady !== "undefined") {
                gameReady = true;
            }
        }
    }, 4000);
}

function loadDeferredAssets() {
    requestAnimationFrame(function () {
        loadDeferredTutorial();
        loadDeferredMusic();
    });
}

function startTeamPoker(doc) {
    loadLocalHighScore();
    setupMusicPolicy();
    loadGameFont();
    armAssetTimeout();

    let useSdk = shouldUseInstantSdk();
    if (useSdk) {
        instantSdkPending = true;
    }

    initGameOnce(doc);

    if (!useSdk) {
        instantSdkPending = false;
        instantSdkReady = false;
        tryStartInstantGame();
        return;
    }

    promiseWithTimeout(
        FBInstant.initializeAsync(),
        INSTANT_SDK_TIMEOUT_MS,
        "FBInstant.initializeAsync timed out"
    ).then(function () {
        instantSdkPending = false;
        instantSdkReady = true;
        if (typeof FBInstant.setLoadingProgress === "function") {
            FBInstant.setLoadingProgress(0);
        }
        if (typeof FBInstant.onPause === "function") {
            FBInstant.onPause(function () {
                pauseInstantGame(true);
            });
        }
        reportInstantProgress();
        tryStartInstantGame();
    }).catch(function (err) {
        console.warn("FBInstant.initializeAsync failed, starting locally", err);
        instantSdkPending = false;
        instantSdkReady = false;
        tryStartInstantGame();
    });
}

document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        pauseInstantGame(false);
    } else {
        resumeInstantGame();
    }
});

window.addEventListener("focus", function () {
    if (!document.hidden) {
        resumeInstantGame();
    }
});
