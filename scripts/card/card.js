// Card function is used to set properties of a card.
// @param this.suit - The suit of the card
// @param this.value - The value of the card
// @param this.imagePath - The path of the card image
// @param this.bitmap - The bitmap of the path's image in a new Image()
// @param this.bitmap.onload - The callback when the image is loaded
let cardBitmapByPath = {};

function getCardBitmap(path) {
    if (cardBitmapByPath[path]) {
        return cardBitmapByPath[path];
    }
    let img = new Image();
    img.onload = function () {
        imageLoaded();
        if (typeof gameReady !== "undefined" && gameReady && typeof drawBoard === "function") {
            drawBoard();
        }
    };
    img.onerror = imageLoaded;
    img.src = path;
    cardBitmapByPath[path] = img;
    return img;
}

function Card(s, v, p) {
    this.suit = s;
    this.value = v;
    this.imagePath = p;
    this.bitmap = getCardBitmap(p);
}
