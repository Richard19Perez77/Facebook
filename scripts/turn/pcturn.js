let pcTurnTimerId = null;
let pcTurnQueued = false;

function clearPcTurnTimer() {
  if (pcTurnTimerId !== null) {
    clearTimeout(pcTurnTimerId);
    pcTurnTimerId = null;
  }
}

function runPcMoveAfterDelay() {
  pcTurnTimerId = null;
  if (gamePaused) {
    pcTurnQueued = true;
    return;
  }
  pcTurnQueued = false;

  movePlayerCard();
  newGameButton.disabled = false;
  endTurnButton.disabled = false;
  endTurnClicked();

  if (!gameOver) {
    document.getElementById("endTurnButton").focus();
  }
}

function schedulePcTurn() {
  clearPcTurnTimer();
  if (gamePaused) {
    pcTurnQueued = true;
    return;
  }
  pcTurnQueued = true;
  pcTurnTimerId = setTimeout(runPcMoveAfterDelay, PC_TURN_DELAY);
}

function pausePcTurnTimer() {
  if (pcTurnTimerId !== null) {
    clearPcTurnTimer();
    pcTurnQueued = true;
  }
}

function resumePcTurnTimer() {
  if (gamePaused || !pcTurnQueued || pcTurnTimerId !== null) {
    return;
  }
  schedulePcTurn();
}

function playerMoveSwitch() {
  newGameButton.disabled = true;
  endTurnButton.disabled = true;
  schedulePcTurn();
}

function movePlayerCard() {
  switch (targetHand) {
    case 0:
      if (runAutoHc) {
        if (doDebugLog) addLog("hc player " + (playerTurn + 1) + " " + printCardArr(getPlayerCards()));
        findHCcard();
        if (doDebugLog) addLog("hc player " + (playerTurn + 1) + " " + printCardArr(getPlayerCards()));
      }
      break;
    case 1:
      if (runAuto2k) {
        if (doDebugLog) addLog("2k player " + (playerTurn + 1) + " " + printCardArr(getPlayerCards()));
        find2Kcard();
        if (doDebugLog) addLog("2k player " + (playerTurn + 1) + " " + printCardArr(getPlayerCards()));
      }
      break;
    case 2:
      if (runAuto3k) {
        if (doDebugLog) addLog("3k player " + (playerTurn + 1) + " " + printCardArr(getPlayerCards()));
        find3Kcard();
        if (doDebugLog) addLog("3k player " + (playerTurn + 1) + " " + printCardArr(getPlayerCards()));
      }
      break;
    case 3:
      if (runAutoSt) {
        if (doDebugLog) addLog("str player " + (playerTurn + 1) + " " + printCardArr(getPlayerCards()));
        findStraightCard();
        if (doDebugLog) addLog("str player " + (playerTurn + 1) + " " + printCardArr(getPlayerCards()));
      }
      break;
    case 4:
      if (runAutoFl) {
        if (doDebugLog) addLog("flush player " + (playerTurn + 1) + " " + printCardArr(getPlayerCards()));
        findFlushCard();
        if (doDebugLog) addLog("flush player " + (playerTurn + 1) + " " + printCardArr(getPlayerCards()));
      }
      break;
    case 5:
      if (runAuto4k) {
        if (doDebugLog) addLog("4k player " + (playerTurn + 1) + " " + printCardArr(getPlayerCards()));
        find4KCard();
        if (doDebugLog) addLog("4k player " + (playerTurn + 1) + " " + printCardArr(getPlayerCards()));
      }
      break;
    case 6:
      if (runAutoSF) {
        if (doDebugLog) addLog("sf player " + (playerTurn + 1) + " " + printCardArr(getPlayerCards()));
        findStraightFlushCard();
        if (doDebugLog) addLog("sf player " + (playerTurn + 1) + " " + printCardArr(getPlayerCards()));
      }
      break;
  }
}
