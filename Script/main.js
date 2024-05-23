
import { initMap, createTwoDiv, removeOldBricks } from './buildMap.mjs'
import { homeHtml, allBrickHome } from './templates.mjs'
import { play } from './gameplay.mjs'
import { playSound } from "./utils.mjs";
import { theChoosenMap } from './core.mjs';

let ifSelectMap = false;
document.addEventListener('DOMContentLoaded', function () {
  start()
  let life = 3
  document.addEventListener('keypress', function (e) {
    let selectMap = document.getElementById("selectMap")
    if (e.key === 'Enter' && !ifSelectMap) {

      cleanUp()
      let gameBody = document.getElementById("gameBody")
      let choosedMap = `<div id="selectMap">
      <div id="title"></div>
      <div id="threeMap">
      </div>
    </div>`

      setTimeout(() => {
        gameBody.innerHTML += choosedMap
        ifSelectMap = true
      }, 200);

      setTimeout(() => {
        document.getElementById("threeMap").innerHTML += '<div id="first"><img src="assets/first.png" alt=""></div>'
      }, 250);

      setTimeout(() => {
        document.getElementById("threeMap").innerHTML += '<div id="second"><img src="assets/second.png" alt=""></div>'
      }, 300);

      setTimeout(() => {
        document.getElementById("threeMap").innerHTML += '<div id="third"><img src="assets/third.png" alt=""></div>'
      }, 400);

      setTimeout(() => {
        let title = document.getElementById("title")
        title.innerHTML = "veuillez choisir une map"
        title.classList.add("myanime")

      }, 700);

      setTimeout(() => {
        selectMap = document.getElementById("selectMap")
        selectMap.style.position = "absolute"
        allEventlistenerForMap(life)
      }, 800);
    }
  })
})


function cleanUp() {
  let brick = document.getElementById("brickImgContainer");
  let logo00 = document.getElementById("bricksansball");
  let betterexp = document.getElementById("betterexp");
  let leftto = document.getElementById("leftright");
  let logo01 = document.getElementById("gameHead");
  let press = document.getElementById("test");
  if (logo00 && press && leftto && betterexp && logo01 && brick) {
    const elementsToRemove = [logo00, press, leftto, betterexp, brick];
    elementsToRemove.forEach((element) => {
      element.classList.add("disparition");
      element.remove();
    });
  }
  removeOldBricks()
}

function start() {
  gameBody.innerHTML = homeHtml
  createTwoDiv()
  initMap(allBrickHome)
}
function allEventlistenerForMap(life) {
  document.getElementById("first").addEventListener("click", function () {
    document.getElementById("selectMap").remove()
    theChoosenMap.laMapChoisie = "first"
    play(life, theChoosenMap.laMapChoisie)
  })
  document.getElementById("second").addEventListener("click", function () {
    document.getElementById("selectMap").remove()
    theChoosenMap.laMapChoisie = "second"
    play(life, theChoosenMap.laMapChoisie)
  })
  document.getElementById("third").addEventListener("click", function () {
    document.getElementById("selectMap").remove()
    theChoosenMap.laMapChoisie = "third"
    play(life, theChoosenMap.laMapChoisie)
  })

}