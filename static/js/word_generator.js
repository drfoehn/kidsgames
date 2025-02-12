$(document).ready(function (){

})

let wordsArray;
fetch('/static/data/words.json')
  .then(res => res.json())
  .then(data => wordsArray = data)
  .then(() => console.log(wordsArray))





let start = document.getElementById("start");
let pause = document.getElementById("pause");
let resume = document.getElementById("resume");
let timer = document.getElementById("timer");
let new_word = document.getElementById("new_word");
let random_word = document.getElementById("random_word");
let reset = document.getElementById("reset");
let noun_select = document.getElementById("selectnoun");
let verb_select = document.getElementById("selectverb");
let allwords_select = document.getElementById("selectallwords");
let select_type = document.querySelector('.select');
let dice = document.getElementById("dice");
let id;
let value = "00:00";



function select_noun(){
    wordtype = $.grep(wordsArray, function (n,i){
        return n.type==='Hauptwort'
    });
}

function select_verb() {
    wordtype = $.grep(wordsArray, function (n, i) {
        return n.type === 'Verb'
    });
}

function select_allwords() {
    wordtype = wordsArray
    };

// $("#selectnoun").click(function(){
//         select_noun();
//         $('#selectnoun').data('clicked', true)
//     })
// $("#selectverb").click(function(){
//         select_verb();
//         $('#selectverb').data('clicked', true)
//     })
// $("#selectallwords").click(function(){
//         select_allwords();
//         $('#selectallwords').data('clicked', true)
//     })


function genRandomWord(){
    let words  = Object.keys(wordtype); // gets an array of keys in the word object.
    let randomNumber = Math.random();
    let wordIndex  = Math.floor(randomNumber * words.length); // This will return a random key  -> Object.keys(words)[0], Object.keys(words)[1], etc
    // Then of course you can use the random key to get a random value -> words['cat'], words['dog'], words['cow'], etc
    let randomKey    = words[wordIndex]; // This will return the value of the randomKey instead of a fresh random value
    console.log(wordIndex)
    let randomValue  = wordtype[randomKey];
    let randomWord = randomValue["name"];

    random_word.innerHTML = randomWord

    console.log(randomValue);
    console.log(randomWord);

}

noun_select.addEventListener('click', function (){
    noun_select.dataset.clicked = "true"
})
verb_select.addEventListener('click', function (){
    verb_select.dataset.clicked = "true"
})
allwords_select.addEventListener('click', function (){
    allwords_select.dataset.clicked = "true"
})

new_word.addEventListener("click", function(){

    if(noun_select.dataset.clicked){
        select_noun();
    } else if(verb_select.dataset.clicked){
        select_verb()
    } else if(allwords_select.dataset.clicked){
        select_allwords()
    } else {
    alert('Wähle zuerst eine Wortart aus');
    };
    genRandomWord();
    delete noun_select.dataset.clicked;
    delete verb_select.dataset.clicked;
    delete allwords_select.dataset.clicked;
    document.body.style.backgroundColor = 'white';
    start.style.display = 'inline-block';
    pause.style.display = 'none';
    timer.style.color = 'black';
    random_word.style.color = "black";
    dice.style.display = 'none';
})

// ------------------------ TIMER FUNCTION ---------------------------

function resetTimer() {
    value = timer;
    clearInterval(value)
}


function startTimer(m, s) {
    timer.textContent = m + ":" + s;
    if (m == 0 && s <=10) {
        timer.style.color = "#ef476f";

    }

    if (s == 0) {
            if (m == 0) {
                timer.style.color = "white";
                document.body.style.backgroundColor = "#ef476f";
                random_word.style.display='inline-block';
                random_word.style.color='white';
                new_word.style.display = 'inline-block'
                reset.style.display = 'none'
                pause.style.display = 'none';
                dice.style.display = 'block';
                allwords_select.style.display = 'block';
                verb_select.style.display = 'block';
                noun_select.style.display = 'block';

                return;
        } else if (m != 0) {
            m = m - 1;
            s = 60;

        }
    }

    s = s - 1;


    reset.addEventListener('click', function(){
                clearInterval(id);
                new_word.style.display = 'inline-block';
                random_word.style.cssText =
                    "display: inline-block;" +
                    "color:'black';"
                start.style.display = 'inline-block';
                pause.style.display = 'none';
                resume.style.display = 'none';
                reset.style.display = 'none'
                dice.style.display = 'block';
                allwords_select.style.display = 'block';
                verb_select.style.display = 'block';
                noun_select.style.display = 'block';
            });
    id = setTimeout(function () {
        startTimer(m, s)
    }, 1000);
}

function pauseTimer() {
    value = timer.textContent;
    clearTimeout(id);
}

function resumeTimer() {
    var t = value.split(":");

    startTimer(parseInt(t[0], 10), parseInt(t[1], 10));
}



start.addEventListener("click", function () {
    startTimer(1, 0);
    start.style.display = 'none';
    pause.style.display = 'inline-block';
    random_word.style.display = 'none';
    new_word.style.display = 'none';
    reset.style.display = 'inline-block';
    allwords_select.style.display = 'none';
    verb_select.style.display = 'none';
    noun_select.style.display = 'none';

}, false);

pause.addEventListener("click", function(){
    pauseTimer();
    pause.style.display = 'none';
    resume.style.display = 'inline-block';
}, false);

resume.addEventListener("click", function(){
    resumeTimer();
    pause.style.display = 'inline-block';
    resume.style.display = 'none';
}, false);


// __________________________________DICE_____________________________________

//select the classes we require
var cube = document.querySelector('.cube');
var rollBtn = document.querySelector('.rollBtn');
var currentClass = '';

//this function will generate a random number between 1 and 6 (or whatever value you send it)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

//our main roll dice function on click
function rollDice() {
//genberate a random number between 1 and 6 with out getRandomInt function
 var randNum =getRandomInt(1,7);
  console.log(randNum )
  //generate a class with the random number between 1 - 6 called showClass
  var showClass = 'show-' + randNum;
  console.log(showClass)
// if there is a class already selected remove it
  if ( currentClass ) {
    cube.classList.remove( currentClass );
  }
// add the new showclass with the generated number
  cube.classList.add( showClass );
//set the current class to the randomly generated number
  currentClass = showClass;
}
// set initial side
rollDice();
// on click eventlistener for the button element
rollBtn.addEventListener("click", rollDice);