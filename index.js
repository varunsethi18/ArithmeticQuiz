var Operators=['+','-','*','/'];
var totalQuestions={};


var question= function(n,questionNumber){
    this.n=n;
    this.randomN = [];
    this.randomOp = [];
    this.questionNumber=questionNumber+1;
    this.answer = undefined;
    this.status= "incorrect";
    this.answerGiven = undefined;
    this.createQues=function(){
        var str="";     
        for(let i=0;i<this.n;i++){
          this.randomN[i]=Math.floor(Math.random()*10);
        } 
        for(let i=0;i<this.n-1;i++){
            this.randomOp[i]=Operators[Math.floor(Math.random()*4)];
        }
    
        for(let i=0;i<this.n;i++){
                 str=str+''+this.randomN[i]
                if(this.randomOp[i] ==undefined){
                    this.answer = eval(str);
                    str =str+' = ?'
                    
                }else{
                    str=''+str+this.randomOp[i];
                }
            }
            this.questionString = str;
            if(this.answer.toString().indexOf("Infinity")!==-1){
                this.createQues();
            } 
                   
    };
    
    
}

function myFunction(){
    let numOfSec=document.getElementById("numberOfSection").value;
    let numOfPar=document.getElementById("numberOfParameters").value;
    let numOfQues=document.getElementById("numberOfQuestions").value;
    document.querySelector('.inputContainer').style.display='none';
     for(let i=0;i<numOfSec;i++)
     {   
         let el=document.getElementById("mainContainer");  
         el.insertAdjacentHTML('beforeend', `<div class='indSection'  id='section-${i}'>${i+1} Section</div>`);
         var arrOfQues =[];
         for(let i=0;i<numOfQues;i++){
            var quest= new question(numOfPar,i);
            quest.createQues();
            arrOfQues.push(quest);
        }
         totalQuestions["question_"+i]=arrOfQues;        
         appendQuestion(arrOfQues[0],i)
        }   
   
      console.log(arrOfQues);
    return false;
}

function appendQuestion(question,sectionId){
    var nodeString = `<form name ='questionForm' class='questionContainer' id ='questionContainer-${sectionId}' onsubmit="return submitAnswer(this,${question.questionNumber},${sectionId})"><div><span>Q${question.questionNumber}.</span>
    <span id ='questionString-${sectionId}'>${question.questionString}</span></div>    
    <div id ='answerContainer-${sectionId}'><span>Ans.</span>
    <span>  <input class='answer' id ='answer-${sectionId}' type="number" name="answer"></span></div>
    <input type="submit" value="Submit"></input></form>`;
    let element=document.getElementById("section-"+sectionId);  
    element.innerHTML =nodeString;
    let el=document.getElementById("note");  
    el.style.display = 'block' ;

}

function submitAnswer(el,qNumber,sectionId){
    var answerGiven = el.getElementsByClassName("answer")[0].value;
    qNumber =qNumber-1;
    totalQuestions["question_"+sectionId][qNumber].answerGiven =answerGiven;
    console.log(totalQuestions["question_"+sectionId][qNumber].answerGiven==totalQuestions["question_"+sectionId][qNumber].answer);
    if(totalQuestions["question_"+sectionId].length-1==qNumber){
        showScore(sectionId);
    }else{
        appendQuestion(totalQuestions["question_"+sectionId][qNumber+1],sectionId);
    }
    return false;
}

function showScore(sectionId){
    let qElement=document.getElementById("questionContainer-"+sectionId);  
    qElement.style.display = 'none' ;
    var score=calculateScore(sectionId);
    var nodeString = `<h4>Thank you for the quiz. Your Score is: <h2 style="color:orange">${score.correctAnswers}/${score.totalQuestionSize}</h2></h4>
    <div>Below is the Stats of your quiz.</div></br>
    <div class='answer-skip'>* blue clolor indicates skipped question</div>
    <div class='answer-incorrect'>* red clolor indicates incorrect question</div>
    <div class='answer-correct'>* green clolor indicates correct question</div></br>`
    let element=document.getElementById("section-"+sectionId);  
    element.insertAdjacentHTML('beforeend',nodeString);
    showStats(sectionId,totalQuestions["question_"+sectionId]);
}

function calculateScore(sectionId){
    var correctAnswers = 0, totalQuestionSize =totalQuestions["question_"+sectionId].length,score={};
        for(let i = 0; i< totalQuestionSize;i++){
            let correctAnswer = totalQuestions["question_"+sectionId][i].answer;
            let answerGiven =  totalQuestions["question_"+sectionId][i].answerGiven;
            if(answerGiven ===undefined||answerGiven ===""){
                totalQuestions["question_"+sectionId][i].status="skip";
            }
            else if(correctAnswer.toFixed(2) ===Number(answerGiven).toFixed(2)){
                totalQuestions["question_"+sectionId][i].status="correct";
                correctAnswers++;
            }
        }
        score.correctAnswers=correctAnswers;
        score.totalQuestionSize =totalQuestionSize;
        return score;
}
function showStats(sectionId,questions){
    var totalQuestionSize =questions.length;
    for(let i =0;i<totalQuestionSize;i++){
        var status = questions[i].status;
        var nodeString = `<div class='answer-${status}'>
        <div><span>Q${questions[i].questionNumber}.</span>
        <span>${questions[i].questionString}</span></div> 
        <div><span>Answer Given: ${questions[i].answerGiven}</span></br><span>Correct Answer: ${questions[i].answer}</span></div></br>
        </div>`;
        let element=document.getElementById("section-"+sectionId);  
        element.insertAdjacentHTML('beforeend',nodeString);

    }

}


