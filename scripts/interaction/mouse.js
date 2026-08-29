function doMouseDown(event) {
  if (touchInputActive) {
    return;
  }
  if (isPlayerTurn() && gameReady) {
    eventToBoardCoords(event);
    if (doDebugLog) addLog("mouse down x=" + mouseX + " , y=" + mouseY);
    cardClickedOn();
    if (doDebugLog) addLog("mouse down cardSelected=" + cardSelected);

    removeCardHighlights();

    drawBoard();
  }
}

function doMouseMove(event) {
  if (touchInputActive) {
    return;
  }
  if (isPlayerTurn() && gameReady && cardSelected !== -1) {
    if (doDebugLog) addLog("mouse move cardSelected=" + cardSelected);
    eventToBoardCoords(event);
    placeHolderMouseOverCardIndex = placeholderMoveOn();
    drawBoard();
    drawMovingCard();
  }
}

function doMouseUp(event) {
  if (touchInputActive) {
    touchInputActive = false;
    return;
  }
  if (isPlayerTurn() && gameReady) {
    if (doDebugLog) addLog("mouse up in cardSelected=" + cardSelected);
    eventToBoardCoords(event);
    placeholderClickedOn();

    drawBoard();
    cardSelected = -1;
    if (doDebugLog) addLog("mouse up out cardSelected=" + cardSelected);
  }
}

function doMouseOut(event) {
  if (touchInputActive) {
    return;
  }
  if (isPlayerTurn() && gameReady) {
    cardSelected = -1;
    drawBoard();
  }
}

function doTouchStart(event) {
  event.preventDefault();
  touchInputActive = true;
  if (!(isPlayerTurn() && gameReady)) {
    return;
  }
  eventToBoardCoords(event);

  let previousSelected = cardSelected;
  cardClickedOn();
  if (cardSelected !== -1) {
    removeCardHighlights();
    drawBoard();
    return;
  }

  cardSelected = previousSelected;
  if (cardSelected !== -1) {
    placeholderClickedOn();
  }
  cardSelected = -1;
  drawBoard();
}

function doTouchEnd(event) {
  event.preventDefault();
}
