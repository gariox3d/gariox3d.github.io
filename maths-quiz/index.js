const start_btn = document.querySelector(".start_btn button");
const leaderboard = document.querySelector(".leaderboard button");
const info_box = document.querySelector(".instructions");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".math-quiz");
const option_list = document.querySelector(".option_list");
const timeCount = quiz_box.querySelector(".timer .timer_sec");
const timeLine = quiz_box.querySelector("header .time_line");
const timeOff = quiz_box.querySelector("header .time_text");
const next_btn = quiz_box.querySelector(".next_btn");
const result_box = document.querySelector(".result_box");
const send_result = result_box.querySelector(".buttons .restart");
const restart_quiz = result_box.querySelector(".buttons .quit");
const name_box = document.querySelector(".name_box");
const name_input = document.querySelector("#container .name");
const name_btn = document.querySelector("#container .name_btn");

//start of jQuery function
//Keyboard events
// $(document).ready(function(){
//   $(document).keypress(function(event) {
//     if (event.keyCode === 49) { //when 1 is pressed
//       document.getElementById("option1").click()//clicks 1rd option
//     } else if(event.keyCode === 50){ //when 2 is pressed
//       document.getElementById("option2").click()//clicks 2rd option
//     } else if(event.keyCode === 51){ //when 3 is pressed
//       document.getElementById("option3").click()//clicks 3rd option
//     } else if(event.keyCode === 52){ //when 4 is pressed
//       document.getElementById("option4").click()//clicks 4th option
//     } else if(event.which == 13){
//       return false;
//     }
//   })
// }) /*failed because when the spacebar is entered the timeline misbehaves function misbehaves expect that everthing is alright in this function*/
//end of jQuery functions

name_btn.onclick = () => {
  checkName();
};

function checkName() {
  var letters = /^[A-Z\sa-z]+$/; //allows only upper n lower alphabets with space
  name_input.value = name_input.value.match(letters);
  if (document.querySelector("#container .name").value == "") {
    name_input.value = "";
    name_input.placeholder = "you don't have a name?";
  } else {
    name_input.placeholder = "What's your name?";
    name_box.classList.remove("activeName");
    info_box.classList.add("activeInfo");
    username = name_input.value;
    console.log("Your name " + username);
  }
}

// If Start quiz Button Clicked
start_btn.onclick = () => {
  name_box.classList.add("activeName");
};
leaderboard.onclick = () => {
  document.getElementById("leaderboard_link").click();
};

//If Exit Button is Clicked
exit_btn.onclick = () => {
  info_box.classList.remove("activeInfo");
};

//If Continue Button Clicked
continue_btn.onclick = () => {
  info_box.classList.remove("activeInfo");
  quiz_box.classList.add("activeQuiz");
  createQuestions();
  queCounter(0);
  startTimer(timerValue);
  startTimerLine(0);
};

//On clicking it shows result box
next_btn.onclick = () => {
  showResultBox();
  changeText();
};

let que_count = 0;
let counter;
let counterLine;
let timerValue = 15; // Set time
let widthValue = 0;
let userScore = 0;
let correctAns;
let username;

// for restart button
restart_quiz.onclick = () => {
  result_box.classList.remove("activeResult");
  que_count = 0;
  widthValue = 0;
  userScore = 0;
  timeOff.textContent = "Time Left";
  next_btn.style.display = "none";
  clearInterval(counterLine);
  clearInterval(counter);

  let alloptions = option_list.children.length;
  for (let i = 0; i < alloptions; i++) {
    if (option_list.children[i].textContent == correctAns) {
      option_list.children[i].classList.remove("correct");
    }
    option_list.children[i].classList.remove("disabled", "wrong");
  }
};

function randomNumber() {
  return Math.floor(Math.random() * 20 + 1);
}
function randomAnswer(answer) {
  return Math.floor(Math.random() * answer + Math.floor(answer / 2));
}
function createQuestions() {
  var num1 = randomNumber();
  var num2 = randomNumber();

  document.getElementById("num1").innerText = num1;
  document.getElementById("num2").innerText = num2;
  answer = num1 * num2;
  correctAns = answer;
  var options = [];
  var a = Math.floor(Math.random() * 4);
  options[a] = answer;

  for (var i = 0; i < 4; i++) {
    if (a == i) {
      continue;
    }
    options[i] = randomAnswer(answer);
  }
  for (var i = 0; i < 4; i++) {
    document.querySelectorAll(".option")[i].innerText = options[i];
    document
      .querySelectorAll(".option")
      [i].setAttribute("onclick", "optionSelected(this)");
  }
}

function optionSelected(answer) {
  clearInterval(counterLine);
  clearInterval(counter);
  startTimer(15);
  startTimerLine(0);
  let userAns = answer.textContent;
  let alloptions = option_list.children.length;

  if (userAns == correctAns) {
    userScore += 1;
    createQuestions();
    que_count++;
    queCounter(que_count);
    console.log("Answer is Correct");
  } else {
    clearInterval(counterLine);
    clearInterval(counter);
    answer.classList.add("wrong");
    console.log("Answer is wrong");

    for (let i = 0; i < alloptions; i++) {
      if (option_list.children[i].textContent == correctAns) {
        option_list.children[i].setAttribute("class", "option correct");
      }
    }
    for (let i = 0; i < alloptions; i++) {
      option_list.children[i].classList.add("disabled");
    }
    next_btn.style.display = "block";
    console.log("Questions completed");
  }
}

function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    timeCount.textContent = time;
    time--;
    if (time < 9) {
      let addZero = timeCount.textContent;
      timeCount.textContent = "0" + addZero;
    }
    if (time < 0) {
      clearInterval(counter);
      timeCount.textContent = "00";
      timeOff.textContent = "Time Out";

      let alloptions = option_list.children.length;

      for (let i = 0; i < alloptions; i++) {
        if (option_list.children[i].textContent == correctAns) {
          option_list.children[i].setAttribute("class", "option correct");
        }
      }
      for (let i = 0; i < alloptions; i++) {
        option_list.children[i].classList.add("disabled");
      }
      next_btn.style.display = "block";
    }
  }
}

function startTimerLine(time) {
  counterLine = setInterval(timer, 50);
  function timer() {
    time += 0.3125;
    if (time > 100) {
      clearInterval(counterLine);
    } else {
      timeLine.style.width = time + "%";
    }
  }
}

function showResultBox() {
  info_box.classList.remove("activeInfo"); //hide the info box
  quiz_box.classList.remove("activeQuiz"); //hide the quiz box
  result_box.classList.add("activeResult"); //show the result box
  const scoreText = result_box.querySelector(".score_text");
  let scoreTag = "<span>you get<p>" + userScore + "</p> Poin</span>";
  scoreText.innerHTML = scoreTag;
}

function queCounter(index) {
  const bottom_ques_counter = quiz_box.querySelector(".point_no");
  const totalQuesCountTag = index;
  bottom_ques_counter.innerHTML = totalQuesCountTag;
}

function changeText() {
  var changetext = document.querySelector(".complete_text");
  changetext.innerHTML =
    "Happy " + username + "! you have successfully completed the quiz";
}

send_result.onclick = () => {
  encript();
};

function randomAlpha() {
  return String.fromCharCode(64 + parseInt(Math.floor(Math.random() * 26 + 1)));
}

function encript() {
  var encriptScore = "" + (userScore + 1527);
  var encript = encriptScore.split("");
  arr = [
    "w",
    "P",
    "f",
    "R",
    "i",
    "Y",
    "A",
    "a",
    "g",
    "N",
    "q",
    "s",
    "U",
    "m",
    "T",
  ];
  for (var i = 0; i < encript.length; i++) {
    encript[i] = arr[encript[i]];
  }
  var r = randomAlpha();
  var s = randomAlpha();
  var q = randomAlpha();
  link =
    "https://api.whatsapp.com/send?phone=919172389527text=Name%3A%20" +
    username +
    "%0Acode%3A%20*" +
    r +
    encript.join("") +
    s +
    q +
    "*%0AScore%3A%2" +
    userScore;
  var l = document.getElementById("link");
  l.setAttribute("href", link);
  l.click();
}