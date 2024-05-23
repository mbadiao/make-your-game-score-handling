import { init, resetGameState, startGame } from "./gameplay.mjs";
import {
  pauseHTML,
  gameoverHTML,
  skeletonHTML,
  winHTML,
  tileMap,
  nameForScore,
  pagi
} from "./templates.mjs";
import { collisionBallBrick } from "./collision.mjs";
import { playSound, removeHeart, addHeart, initHeart } from "./utils.mjs";
import { createTwoDiv } from "./buildMap.mjs";

export let theChoosenMap = {
  laMapChoisie: "",
}

var posX = 0;
var player = document.createElement("div");
const fail = "/sounds/failure.wav",
  pop = "/sounds/pop.wav",
  success = "/sounds/success.wav",
  laugh = "/sounds/laugh.wav";

var isPaused = false;
var isGameOver = false;
let timer = 0, timerInterval = null, timerControl;

function build(gameBody, secondDiv) {
  posX = gameBody.offsetHeight / 2 + 150;
  console.log(gameBody.offsetHeight / 2 + player.offsetWidth + 10);
  player.classList.add("divAMover");
  secondDiv.appendChild(player);

  var vitesseDeplacement = 10;
  var toucheGauchePressee = false;
  var toucheDroitePressee = false;

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      toucheGauchePressee = true;
    } else if (event.key === "ArrowRight") {
      toucheDroitePressee = true;
    }
  });

  document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft") {
      toucheGauchePressee = false;
    } else if (event.key === "ArrowRight") {
      toucheDroitePressee = false;
    }
  });

  function mettreAJourPosition() {
    if (toucheGauchePressee) {
      posX = Math.max(posX - vitesseDeplacement, 0);
    }
    if (toucheDroitePressee) {
      posX = Math.min(
        posX + vitesseDeplacement,
        gameBody.clientWidth - player.offsetWidth
      );
    }
  }

  return {
    deplacerDiv: function () {
      posX = Math.min(
        Math.max(posX, 0),
        gameBody.clientWidth - player.offsetWidth
      );
      player.style.transform = `translateX(${posX}px)`;
    },
    mettreAJourPosition: mettreAJourPosition,
  };
}

function ball(gameBody, life, vitesse) {
  const b = {
    x: gameBody.offsetWidth / 2,
    y: 250,
    w: 20,
    h: 20,
    dx: 0,
    dy: 1,
    speed: vitesse,
  };
  const ball = document.createElement("div");
  gameBody.append(ball);
  ball.id = "ball";
  ball.style.backgroundColor = "red";
  ball.style.borderRadius = "50%";
  ball.style.width = `${b.w}px`;
  ball.style.height = `${b.h}px`;
  ball.style.left = `${b.x}px`;
  ball.style.marginTop = `-${gameBody.offsetHeight + 0.04 * gameBody.offsetHeight
    }px`;

  function mover() {
    if (b.x > gameBody.offsetWidth - b.w || b.x < 0) {
      b.dx *= -1;
    }
    if (b.y < b.h) {
      b.dy *= -1;
    }
    if (b.y > gameBody.offsetHeight) {
      b.dy *= -1;
      retry(life);
      posX = gameBody.offsetHeight / 2 + 150;
      return;
    }

    const [brickCollision, brickId, collisionDirection] = collisionBallBrick(
      b.x,
      b.y
    );
    if (collisionDirection == "top" || collisionDirection == "bottom") {
      b.dy *= -1;
      checkWin();
    } else if (collisionDirection == "left" || collisionDirection == "right") {
      b.dx *= -1;
      checkWin();
    }
    var divRect = player.getBoundingClientRect();
    var ballRect = ball.getBoundingClientRect();

    if (
      ballRect.top < divRect.bottom &&
      ballRect.bottom > divRect.top &&
      ballRect.left < divRect.right &&
      ballRect.right > divRect.left
    ) {
      var intersectX = Math.min(Math.max(b.x + b.w / 2, posX), posX + 150);
      var relativeIntersectX = intersectX - (posX + 150 / 2);
      var normalizedRelativeIntersectionX = relativeIntersectX / (150 / 2);
      var bounceAngle = (normalizedRelativeIntersectionX * Math.PI) / 3;
      b.dx = Math.sin(bounceAngle);
      b.dy = -Math.cos(bounceAngle);
      // playSound(pop);
    }

    b.x += b.dx * b.speed;
    b.y += b.dy * b.speed;
    ball.style.transform = `translate(${b.x}px,${b.y}px)`;
  }

  return mover;
}

function checkWin() {
  let NbrOfBricks = Array.from(
    document.getElementsByClassName("setBrick")
  ).length;
  if (NbrOfBricks == 0) {

    let time = getfinalTime();
    let time2 = time.replace("Time:", "")
    let score = getmyfinalscore()

    isGameOver=true

    playSound(success);
    document.body.innerHTML = winHTML;
    document.getElementById("yourtime").innerHTML = "Your " + time;
    document.getElementById("yourscore").innerHTML = "Your Score: " + score;
    askfortabscore(score, time2)
    gameEnd();
  }
}

export function gameLoop(gameBody, secondDiv, life, vitesse) {
  timerControl = startTimer();
  timerControl.resume();
  timerControl = startTimer();

  console.log("ISGAMEOVER", isGameOver);
  var player = build(gameBody, secondDiv);
  var moverBall = ball(gameBody, life, vitesse);
  var requestId;
  function pauseGame() {
    isPaused = true;
    cancelAnimationFrame(requestId);
  }

  function resumeGame() {
    if (!isGameOver) {
      isPaused = false;
      requestId = requestAnimationFrame(animationLoop);
    }
  }

  function animationLoop() {
    if (!isPaused && !isGameOver) {
      player.mettreAJourPosition();
      player.deplacerDiv();
      moverBall();
    }
    if (isGameOver) {
      console.log("gameover GAMELOOP");
      gameOver();
      return;
    }
    requestId = requestAnimationFrame(animationLoop);
  }

  animationLoop();

  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      // case "r":
      //   if (isPaused) {
      //     timerControl.reset();
      //     hidePauseMenu();
      //     restartGame(theChoosenMap.laMapChoisie);
      //   }
      //   break;
      case "p":
        if (!isPaused && !isGameOver) {
          timerControl.pause();
          showPauseMenu();
        }
        break;
      // case "c":
      //   timerControl.resume();
      //   hidePauseMenu();
      //   break;
      // case "q":
      //   location.reload();
      //   break;
      default:
        break;
    }
  });

  document.getElementById("pause").addEventListener("click", showPauseMenu);
}

function showPauseMenu() {
  isPaused = true;
  document.body.insertAdjacentHTML("beforeend", pauseHTML);
  document.getElementById("replay").addEventListener("click", function () {
    hidePauseMenu();
  });
  document.getElementById("restart").addEventListener("click", function () {
    hidePauseMenu();
    restartGame(theChoosenMap.laMapChoisie);
  });
  document.getElementById("quit").addEventListener("click", function () {
    location.reload()
  });
}

export function hidePauseMenu() {
  var pauseMenu = document.getElementById("pauseMenu");
  var overlay = document.getElementById("overlay");
  if (pauseMenu) {
    pauseMenu.parentNode.removeChild(pauseMenu);
  }
  if (overlay) {
    overlay.parentNode.removeChild(overlay);
  }
  isPaused = false;
}

function startTimer() {
  let myTime;
  const timeText = document.getElementById("timer")
  function updateTime() {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    myTime = "Time: " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    timeText.textContent = myTime
  }

  function start() {
    if (timerInterval === null) {
      timerInterval = setInterval(function () {
        timer++;
        updateTime();
      }, 1000);
    }
  }

  function pause() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function reset() {
    timer = 0;
    updateTime();
  }

  start();

  return {
    pause: pause,
    resume: start,
    reset: reset,
  };
}

function getmyfinalscore() {
  let score = document.querySelector(".score");
  score.textContent = Number(score.textContent);
  return score.textContent;
}

function getfinalTime() {
  let timer = document.getElementById("timer");
  timer.textContent = timer.textContent;
  return timer.textContent;
}

function retry(life) {
  life--;
  console.log("LIFE RETRY", life);
  if (life == 0) {
    const myfinalscore = getmyfinalscore();
    const myfinaltime = getfinalTime()
    timerControl.reset();
    timerControl.pause();
    playSound(laugh);
    document.body.innerHTML = gameoverHTML;

    askfortabscore(myfinalscore, myfinaltime)

    document.getElementById("myscore").innerHTML = myfinalscore;
    isGameOver = true;
    return;
  } else {
    playSound(fail);
    resetGameState(life, theChoosenMap.laMapChoisie);
  }
}

function askfortabscore(myfinalscore, myfinaltime) {
  setTimeout(() => {
    document.body.innerHTML += nameForScore;

    const inputElement = document.getElementById('nameofplayer');
    const buttonElement = document.getElementById('sendButton');
    let datatosend = {
      name: "",
      score: 0,
      time: ""
    }

    buttonElement.addEventListener('click', function () {
      const playerName = inputElement.value;
      console.log('Player Name:', playerName);
      // Vous pouvez ensuite utiliser `playerName` pour d'autres opérations
      if (playerName != '') {
        document.getElementById("overlay").remove()
        document.getElementById("askname").remove()
        datatosend = {
          name: playerName,
          score: Number(myfinalscore),
          time: myfinaltime.replace("Time:", "")
        }

        fetch("http://localhost:8080/postdata", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datatosend)
        })

        fetch("http://localhost:8080/getdata", {
          method: 'GET',
        })
          .then(response => response.json())
          .then(data => {
            console.log("c'est bien", data);
            tabScore(data)
            stat(data, datatosend)
          })
          .catch(err => {
            console.log("error man");
          })
      }

    });
  }, 1000);
}

function stat(data, senddata) {
  data = sortData(data); // Trier les données
  const playerstat = document.getElementById("playerstat");

  for (let i = 0; i < data.length; i++) {
    if (senddata.name === data[i].name && senddata.score === data[i].score && senddata.time === data[i].time) {
      const percentage = Math.floor((data[i].rank / data.length) * 100);
      playerstat.textContent = `You are in the top ${percentage}%, on the ${data[i].rank} position`;
      break; // Sortir de la boucle une fois le joueur trouvé
    }
  }
}

function tabScore(data) {
  console.log("je suis la");
  const body = document.querySelector("body")
  let scoreContainer = document.createElement("div")
  scoreContainer.classList.add("scoreContainer")
  body.appendChild(scoreContainer)
  scoreContainer.innerHTML = pagi
  // scoreContainer.innerText=JSON.stringify(data)
  pagination(sortData(data))
}

function restartGame(choosedMap) {
  console.log("alert!!!!!!!!!!");
  let second = document.getElementById("secondDiv");
  let life = 3;
  document.getElementById("ball").remove();
  isGameOver = false;

  setTimeout(() => {
    console.log('here!!!!!!!!!!!!!!')
    document.getElementById("hearts").remove();
    initHeart();
    addHeart();
    gameBody.classList.add("gamebody");
    init(theChoosenMap.laMapChoisie);
    // gameLoop(gameBody, second, life, );


    if (choosedMap == "first") {
      gameLoop(gameBody, second, life, tileMap.first.vitesse)
      console.log("vitesse: ", tileMap.first.vitesse);
    } else if (choosedMap == "second") {
      gameLoop(gameBody, second, life, tileMap.second.vitesse)
    } else {
      gameLoop(gameBody, second, life, tileMap.third.vitesse)
    }


    isPaused = false;
  }, 490);
}

function recommenceAfterwin() {
  let life = 3;
  isGameOver = false;
  document.body.innerHTML = skeletonHTML;
  createTwoDiv();
  initHeart();
  startGame(life, theChoosenMap.laMapChoisie);
}

function recommence() {
  // document.getElementById("finish").remove();
  recommenceAfterwin();
}

function reloadFromStart() {
  location.reload();
}

function gameOver() {
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      // case "r":
      //   // document.getElementById("hearts").remove()
      //   // recommence();
      //   break;
      // case "q":
      //   reloadFromStart();
      //   break;
      default:
        break;
    }
  });
  document.getElementById("restartR").addEventListener("click", recommence);
  document.getElementById("quitQ").addEventListener("click", reloadFromStart);
}

function gameEnd() {
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      // case "r":
      //   recommenceAfterwin();
      //   break;
      // case "q":
      //   reloadFromStart();
      //   break;
      default:
        break;
    }
  });
  document
    .getElementById("rplay")
    .addEventListener("click", recommenceAfterwin);
  document.getElementById("qquit").addEventListener("click", reloadFromStart);
}





















function pagination(datadata) {
  // const datadata = [
  //   { id: 1, name: "John Doe", age: 28 },
  //   { id: 2, name: "Jane Smith", age: 34 },
  //   { id: 3, name: "Kevin Brown", age: 45 },
  //   // Ajoutez plus de données ici
  //   { id: 4, name: "Alice Johnson", age: 23 },
  //   { id: 5, name: "David Wilson", age: 31 },
  //   { id: 6, name: "Ella Moore", age: 29 },
  //   { id: 7, name: "Paul White", age: 41 },
  //   { id: 8, name: "Emily Davis", age: 35 },
  //   { id: 9, name: "Peter Harris", age: 30 },
  //   { id: 10, name: "Linda Clark", age: 50 },
  // ];

  const rowsPerPage = 5;
  let currentPage = 1;

  const tableBody = document.querySelector('#data-table tbody');
  const pageInfo = document.getElementById('page-info');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  function displayTable(page) {
    // Calculer les index de début et de fin pour les données à afficher
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = datadata.slice(start, end);

    // Vider le corps du tableau
    tableBody.innerHTML = '';

    // Ajouter les nouvelles lignes
    paginatedData.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.rank}</td>
        <td>${row.name}</td>
        <td>${row.score}</td>
        <td>${row.time}</td>
      `;
      tableBody.appendChild(tr);
    });

    // Mettre à jour les informations de pagination
    pageInfo.textContent = `Page ${page} sur ${Math.ceil(datadata.length / rowsPerPage)}`;

    // Désactiver les boutons si nécessaire
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === Math.ceil(datadata.length / rowsPerPage);
  }

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayTable(currentPage);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < Math.ceil(datadata.length / rowsPerPage)) {
      currentPage++;
      displayTable(currentPage);
    }
  });

  // Afficher la première page au chargement
  displayTable(currentPage);
}

function sortData(data) {
  // Fonction pour comparer les scores et les temps
  data.sort((a, b) => {
    // Comparer les scores (tri décroissant)
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;

    // Si les scores sont égaux, comparer les temps (tri croissant)
    let timeA = a.time.split(":").map(Number);
    let timeB = b.time.split(":").map(Number);

    let minutesA = timeA[0] * 60 + timeA[1];
    let minutesB = timeB[0] * 60 + timeB[1];

    return minutesA - minutesB;
  });

  // Mettre à jour les rangs après le tri
  data.forEach((item, index) => {
    item.rank = index + 1;
  });


  let rstart=document.getElementById("restartR")
  let quitq=document.getElementById("quitQ")
  if (rstart && quitq){
    rstart.addEventListener("click", recommence);
    quitq.addEventListener("click", reloadFromStart);
  }

  let rplayy=document.getElementById("rplay")
  let qquitt=document.getElementById("qquit")
  if ( rplayy && qquitt){
    rplayy.addEventListener("click", recommenceAfterwin);
    qquitt.addEventListener("click", reloadFromStart);
  }

  return data;
}