// This code will run as soon as the page loads
window.onload = function() {
  $("#starter").on("click", function() {
    start();
   //tenQuestions(); 
  });
  $("#answers-div").on("click", ".dataOption", function(){
    name = $(this).attr("name");
    compareAnswer(name);
   //tenQuestions();
  });
  $("#start-over").on("click", function() {
    correct=0;
    wrong=0;
    unanswered=0;
    j=0;
    $("#start-over").empty();
    start();
  });
};

var correct = 0;
var wrong = 0;
var unanswered = 0; 
var correctAnswer = ""; // To store the correct answer given by the Trivia API
var i = 0;       // Variable used as index to display the 4 answer options
var j = 0;       // Variable used as index to display the 10 questions.
var result = []; // Variable to store the array obtanied for the Trivia API 
var name = "";   // To store the attribute "name" of the options selected by the user
var correctFlag;

// Generate the start button 
var questionAnswer = $("<div>"); 
var starting = $("<button>");
starting.text("Start");
starting.addClass("button");
questionAnswer.append(starting);
$('#starter').append(questionAnswer);

//To make the call to the Trivia API and store the response in the variable result
function start(){
  $.ajax({
    //url: "https://opentdb.com/api.php?amount=10&category=17&difficulty=easy&type=multiple",
    //url: "https://opentdb.com/api.php?amount=10&category=14&difficulty=easy&type=multiple",
    url: "https://opentdb.com/api.php?amount=10&category=32&difficulty=medium&type=multiple",  //Category: Cartoon & Animations
    method: "GET"
  }).done(function(resp) {

    $("#starter").empty();  // To remove the initial Start button
    result = resp.results;
    console.log(result);
    tenQuestions(); //Call function to display the 1st question 
  }); // End of .done function
} //End of start()

function tenQuestions() {
  if (j < 5) {   //Here is indicated the number of questions to display (maximum 10)    
  $("#display-timer").text("Time Remaining: " + time + " Seconds");
    console.log("correct answer: " + result[j].correct_answer);
    var number = Math.floor(Math.random() * 4);
    
    //Clear the div, specially when display question#2 and following
    $("#question").empty();
    $("#answers-div").empty();
    
    //Variable to store the correct answer    
    correctAnswer = result[j].correct_answer;
    
    //Array and for-loop store the correct answer in a random place to be displayed (stored ramdomly) in a 4 options array)
    displayValue(result[j].question, "question");  //Display Question on Screen

    //Array to store the 4 anwsers, including the correct one
    var answersArray = []; 
    for (var i = 0; i < 4; i++ ) {
      if (i < number ) {
        answersArray[i] = result[j].incorrect_answers[i];
      } else if (i > number) {
        answersArray[i] = result[j].incorrect_answers[i-1];
      } else {                                     //Stores the correct answer in the random position of the array 
        answersArray[i] = result[j].correct_answer;
      }
      reset(); //Reinitialize timer values to 30 secs per question
      startTimer(); //Start timer to answer each question
      displayValue(answersArray[i], "dataOption"); //Call function to display information on screen
    } // End of i-for-loop
  } else { // This is executed when all the questions are answered to show the final scores
    stopTimer();
    finalScore();
  } //End of if-else
}// End of tenQuestions()

function compareAnswer(nameHere){
  if (nameHere === correctAnswer) {
    correct++;
    $("#answers-div").empty();
    //$("#question").()
    //compareFlag = true;
    $("#question").text("Correct!");
    console.log("corrects: " + correct);
  } else {
    wrong++;
    console.log("wrong: " + wrong);
    //compareFlag = false;
    $("#question").text("Nope!");
  }
  j++;
  showAnswer();
} // End of compareAnswer function

function showAnswer() {
  stopTimer();
  $("#answers-div").text("The Correct Answer is: " + correctAnswer);
  setTimeout(tenQuestions, 5000);  //Time to show the correct answer in display
} // End showAnswer()

function displayValue(info, typeAttr) {
  var questionAnswer = $("<div>");
  questionAnswer.addClass(typeAttr);  //typeAttr is the parameter to add the class to the elements in answers-div
  questionAnswer.attr("name", info);
  questionAnswer.append("<p>" + info + "</p>");
  $('#answers-div').append(questionAnswer);
} // End displayValue function

function finalScore() {
  stopTimer();
  $("#question").empty();
  $("#answers-div").empty();
  displayValue("All done, here is how you did !!!", "question");
  displayValue("Correct Answers: " + correct, "answers-div");
  displayValue("Incorrect Answers: " + wrong, "answers-div");
  displayValue("Unanswered: " + unanswered, "answers-div");
  $('#start-over').text("Start Over?");
} //End of finalScore()


/*================================================================
  Code for the counter of secs available to answer the questions */

//  Variable that will hold our setInterval that runs the stopwatch
var intervalId;

//prevents the clock from being sped up unnecessarily
var clockRunning = false;
var time = 22;

function reset() {
  time = 22;
  $("#display-timer").text("Time Remaining: " + time + " Seconds");
} //End of reset

function startTimer() {
  $("#display-timer").text("Time Remaining: " + time + " Seconds");
  if (!clockRunning) {
        intervalId = setInterval(count, 1000);
        clockRunning = true;
  } //End of if
} //End of startTimer()

function stopTimer() {
  // DONE: Use clearInterval to stop the count here and set the clock to not be running.
  clearInterval(intervalId);
  clockRunning = false;
} //End of stop()

function count() {
  time--;
  if (time >= 0 ) {
  //var converted = timeConverter(time);
  $("#display-timer").text("Time Remaining: " + time + " Seconds");
  } else { //Time is up and next question or results are shown
    j++;
    unanswered++;
    console.log("Unanswered: " + unanswered);
    $("#question").text("Out of Time!"); 
    showAnswer();
  } //End of if-else
} //End of count()



  /* NEXT STEPS:
 Done - Compare attribute name from selected option with the correct answer.
 Done - Add counters for correct answers, incorrect answers and not answered.
 Done  - Add logic to show correct/incorrect answer when option is selected. 
 Done - Add timer and display it on screen above question.
 Done - Modify logic to include to show answer if no option is selectedin the alloted time and show "Out of Time!".
 Done - Add for-loop/counter to go through the 10 elements of the array (10 questions).
 Done - Show at the end the summary of the score and the "Start Over" option"
 Done - If start over option is selceted initialize counters and show the next serie of questions.
      - Add API to show GIF for the correct answer, including in the search the content stored in attribute "name".
  */