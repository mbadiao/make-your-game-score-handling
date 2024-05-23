import { initMap, createTwoDiv, removeOldBricks } from "./buildMap.mjs";
import { allBrickMap1, startHtml, heartHtml, tileMap } from "./templates.mjs";
import { playSound, addHeart, initHeart, removeHeart } from "./utils.mjs";
import { gameLoop } from "./core.mjs";

export function play(life, choosedMap) {
  
  initHeart();
  startGame(life, choosedMap);
}

export function init(choosedMap) {
  removeOldBricks();
  // initMap(allBrickMap1);

  if (choosedMap == "first") {
    initMap(tileMap.first.map)
  } else if (choosedMap == "second") {
    initMap(tileMap.second.map)
  } else {
    initMap(tileMap.third.map)
  }
}

export function resetGameState(life, choosedMap) {
  let gameBody = document.getElementById("gameBody");
  let second = document.getElementById("secondDiv");
  document.getElementById("ball").remove();
  setTimeout(() => {
    removeHeart(life);
    // gameLoop(gameBody, second, life);

    if (choosedMap == "first") {
      gameLoop(gameBody, second, life, tileMap.first.vitesse)
    } else if (choosedMap == "second") {
      gameLoop(gameBody, second, life, tileMap.second.vitesse)
    } else {
      gameLoop(gameBody, second, life, tileMap.third.vitesse)
    }


  }, 500);
}

export function startGame(life, choosedMap) {
  let gameBody = document.getElementById("gameBody");
  var second = document.getElementById("secondDiv");
  setTimeout(() => {
    let coeur = document.getElementById("hearts")
    if (!coeur) {
      addHeart();
    }
    gameBody.classList.add("gamebody");
    // init(second, life);
    init(choosedMap)


    if (choosedMap == "first") {
      gameLoop(gameBody, second, life, tileMap.first.vitesse)
    } else if (choosedMap == "second") {
      gameLoop(gameBody, second, life, tileMap.second.vitesse)
    } else {
      gameLoop(gameBody, second, life, tileMap.third.vitesse)
    }




    // gameLoop(gameBody, second, life, vitesse);
  }, 490);
}

