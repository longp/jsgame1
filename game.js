var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// init
init = function(){
  var createCanvas = newCanvas(document),
      newImage = createImage(imageData),
      canvas = createCanvas(512,480),
      reset = resetGame(canvas),
      update = updateGame(reset),
      render = renderGame(newImage, canvas);
      
  //add canvas to dom
  document.getElementById('canvas_container').appendChild(canvas);
  
  //game loop
  var then = Date.now(),
  mainLoop = function(){
    var gameState = gameData,
        now = Date.now(),
        delta = now - then;
    gameState = render(update(gameState, delta /1000));
    then = now;
    requestAnimationFrame(mainLoop);
  };
  gameData = reset(gameData);
  mainLoop();
}

window.addEventListener('load',init);

//player input events
addEventListener('keydown', function(event){
    gameData.player.keysDown[event.keyCode] = true;
  }, false);

addEventListener('keyup', function(event){
    delete gameData.player.keysDown[event.keyCode];
  }, false);

//render game screen
function renderGame(createImage, canvas){
  return function(gameData) {
    var context = canvas.getContext("2d"),
        player = gameData.player,
        badGuy = gameData.badGuy,
    //create and draw images   
    bgImage = createImage('background', function(){
      context.drawImage(bgImage, 0, 0);
    }),
    playerImage = createImage('player', function(){
      context.drawImage(playerImage, player.xPos, player.yPos);
    }),
    badGuyImage = createImage('badGuy', function(){
      context.drawImage(badGuyImage, badGuy.xPos, badGuy.yPos);
    });
    
    //display score
    context.fillStyle = "rgb(250, 250, 250)";
	  context.font = "24px Helvetica";
	  context.textAlign = "left";
	  context.textBaseline = "top";
	  context.fillText("Score: " + gameData.score, 32, 32);
  };
};


//update game
function updateGame(resetGame){
  return function(gameData, modifier){
    var player = gameData.player, badGuy = gameData.badGuy;
    
    if (38 in player.keysDown) { // Player holding up
		player.yPos -= player.speed * modifier;
	  }
    
    if (40 in player.keysDown) { // Player holding down
		player.yPos += player.speed * modifier;
	  }
    
    if (37 in player.keysDown) { // Player holding left
		player.xPos -= player.speed * modifier;
	  }
    
    if (39 in player.keysDown) { // Player holding right
		player.xPos += player.speed * modifier;
	  }
    
    //check for hit
    if (player.xPos <= (badGuy.xPos +32) 
        && badGuy.xPos <= (player.xPos +32) 
        && player.yPos <= (badGuy.yPos +32)
        && badGuy.yPos <= (player.yPos +32)) {
      ++gameData.score;
      gameData = resetGame(gameData);
    }
    return gameData;
  };
};

//reset game
function resetGame(canvas){
  return function(gameData){
    gameData.player.xPos = canvas.width / 2;
    gameData.player.yPos = canvas.height / 2;
    gameData.badGuy.xPos = 32 + (Math.random() * (canvas.width - 64));
    gameData.badGuy.yPos = 32 + (Math.random() * (canvas.height - 64));
    return gameData;
  };
};

//create a canvas
function newCanvas(document){
  return function(width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  };
};

//create an image 
function createImage(imageData) {
  return function(imageName, callback){
    var image = new Image();
    image.src = imageData[imageName];
    image.onload = callback;
    image.onerror = function(e) {console.log('image woes: ' + e)};
    return image;
  };
}

var gameData = {
  player : {
    speed: 256, //PixPerSec
    xPos: 0,
    yPos: 0,
    keysDown: {}
  },
  badGuy : {
    xPos: 0,
    yPos: 0
  },
  score: 0
};

var imageData = {
  background : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAHgBAMAAAAh+sjWAAAAMFBMVEUGDwYIFgkJGAoUMhYZEwocRx8fTyImUB0/gzA/hTA/hjBAbC1LOR9Mck5UPyNegGAQoePyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEz0lEQVR4Xu3aTXHjeBQA8T6EgCh4IMgQlsKKQiCMIXghhEKWQiAkEMYURGEPzmTsyFu6/7v7MvU876R6+Sr9nl6B5QAA5+s/qvkJeU9cDqeZdy7/rDy/gG3uAjicfl2WI/P6yvL8gm3uAgBOHFi5ME3XD01zF8Dpr4V3jq/LAhewzV0A59M8ceTwvlzef4Bt7gJgvXAEmA78+nG2zV0ATO8scHz9uRzXM7a5CwAuJ15ZFpjfwDZ3AcCJ6bIwv/B8/Uw1dwFwfv7758LMM29nLgfZ3AUAL6d/J96AMxxscxfAtHL++DhzWGYA29wFsPIB8wlmPmawzV0AMHN9NjPTim3uAgCY5uu0fn4qmrsA2L4/vz6p6ffzGm7OB9z0yAd8/tfnAxtvzgfc9sAHfNsYbs4H3PUE9+/LDeUDbtr6gGnl61vntI435wPu2/qAFb6+da4DzvmA+57YvD8fvXzAXQ98wJ/Wb78XjDHnA+565AP4/afz1wMca84H3PbIB3z+7Px8bOPN+YDbHviA363AiHM+4K5HPuC2Eed8wG0PfcDdl86Acz7gpkc+gLsvnfHmfMBtj3zAn8ac8wG3/Y8PWAef8wFf5QOQlw9AXj4AefmAveXRywcgLx+AvHzA3vro5QOQlw9AXj4AefkA5OUDkJcPQF4+AHn5AOTlA5CXD0BePgB5+QDk5QP2lkcvH4C8fADy8gF766OXD0BePgB5+QDk5QOQlw9AXj4AefkA5OUDkJcPQF4+AHn5AOTlA5CXD9hbHr18APLyAcjLB+ytj14+AHn5AOTlA5CXD0BePgB5+QDk5QOQlw9AXj4AefkA5OUDkJcPQF4+YG959PIByMsHIC8fsLc+evkA5OUDkJcPQF4+AHn5AOTlA5CXD0BePgB5+QDk5QOQlw9AXj4AefmAveXRywcgLx+AvHzA3vro5QOQlw9AXj4AefkA5OUDkJcPQF4+AHn5AOTlA5CXD0BePgB5+QDk5QP2lkcvH4C8fADy8gF766OXD0BePgB5+QDk5QOQlw9AXj4AefkA5OUDkJcPQF4+AHn5AOTlA5CXD9hbHr18APLyAcjLB+ytj14+AHn5AOTlA5CXD0BePgB5+QDk5QOQlw9AXj4AefkA5OUDkJcPQF4+YG959PIByMsHIC8fsLc+evkA5OUDkJcPQF4+AHn5AOTlA5CXD0BePgB5+QDk5QOQlw9AXj4AefmAveXRywcgLx+AvHzA3vro5QOQlw9AXj4AefkA5OUDkJcPQF4+AHn5AOTlA5CXD0BePgB5+QDk5QP2lkcvH4C8fADy8gF766OXD0BePgB5+QDk5QOQlw9AXj4AefkA5OUDkJcPQF4+AHn5AOTlA5CXD9hbHr18APLyAcjLB+ytj14+AHn5AOTlA5CXD0BePgB5+QDk5QOQlw9AXj4AefkA5OUDkJcPQF4+YG959PIByMsHIC8fsLc+evkA5OUDkJcPQF4+AHn5AOTlA5CXD0BePgB5+QDkPfQBprkLYOsDVHMXsPUBrrkLgK0PMM1dwMYHyOYuYOMDZHMXwMYHuOYugI0PcM1dAGx8gGruAvj2vtw2dwFsfIBr7gLY+gDV3AV8f19um7sAtj5ANXcBwPzNB6jmLgBg6wM8s/4C/gPCHEonpOZggQAAAABJRU5ErkJggg==",
  player:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAASFBMVEUAAAAAAAAAAAAAAAAAfcVYRRtpgpBuViJvYD59kZyDo7SLeE6ctcPLpn7+0J7+2bH/xFH/x4v/yJj/8z7/9WX/+a7/+r7///8xDi3HAAAAA3RSTlMAZmcaB/wEAAAA1UlEQVQ4jZWS2xKDIAwFwaBYLXhplf//03qIqUxnWtJ9IZIdIInGGCKToQLZKZdvAtG+IyC6Z4YM7+SMSkAgKYFoXbdNI+AoBM+CxwHRsryrqAhcYJtBkqOrWI1wtanveYVgjFaQ9qbk3DTF6FxKMRYtrwhSID7jCeJ5xoNzJysCzkBrMSi5rDvhoWmEGIeh66DcMkgShYDL6gLROHofAi66Rg6hbb3XCjwaiCjYHxTjqgrcai62K/gY1k9BNFyBhM/8K1jLAj8NWKsX7An/uEgJTaMQXgQOGP28nGoKAAAAAElFTkSuQmCC",
  badGuy: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAAA+klEQVR42s2WvQ3CMBCFUWCJLEGXAaCghS4UdEh0sAO0mYIdGIOCEdjEYHRPAp4eJ9P4LH1FLPt90fknGaWUfvJsqQTKEFQTk+D7ebicilA5YcQk+Fd4OG8/ULnBxRwo+l3iiNWxEQE+6+MyI49ZFLF/cYglISAmYVAxC2/364thPMnQ5kI/xqlSxxM7pfSOkSo5l766WASLiQKINPSCwcSMF6xKH19MA5yPg1oiEoMwYlmqfT8vQf36UH89sRqglgCCftFleKNxSVujyVQX59YZu3eEGEKEuscJefCEFyNIiAkShhQ3RmtMjZnhXQQbY2VgHnJoc1UVPwARyA+KY6o4FwAAAABJRU5ErkJggg=="
};