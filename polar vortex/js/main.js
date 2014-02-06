var leftKeys=[37]; // left arrow
var rightKeys=[39]; // right arrow
var startKeys=[32]; // space
var livesRemaining=3;
var score=0; // number of icicles successfully dodged
var icicleInterval=setInterval("dropIcicle()",1000);
var clearIcicles=setInterval("clearIcicle()",1000);
var highScore=0;
var lastScore=0;

function randomStartPosition(){
	var randomnumber=Math.floor(Math.random()*20); 
	return (randomnumber*20-10);
}

function randomTimeDelay(){
	var randomDelay=Math.random()*4000;
	return randomDelay;
}

function randomColor(){
	var red=Math.floor(Math.random()*42)+30; // bwn 72 and 30
	var green= Math.floor(Math.random()*117)+116; // bwn 233 and 116
	var hexcolor="rgb("+red+","+green+","+255+")";
	return hexcolor;
}

function clearIcicle(){
	$(".icicle").remove();
}

function dropIcicle(){
	if($(".icicle").length<=40){
		$("#gamespace").prepend('<div class="icicle '+'snowflakeFalling" style="margin-left:'+randomStartPosition()+'px; background:'+randomColor()+'"></div>');
		$(".icicle:after").css("background",randomColor());
	}
}

function startNewGame(){
	icicleInterval=setInterval("dropIcicle()",1000);
}

function movePlayerLeft(){
	if(parseInt($("#player").css("margin-left"))>=0){
		$("#player").css("margin-left","-=20");
	}
}
function movePlayerRight(){
	if(parseInt($("#player").css("margin-left"))<370){
		$("#player").css("margin-left","+=20");
	}
}

function increaseScore(){
	score++;
	$("#score").children("span").text(score);
}

function decreaseLives(){
	livesRemaining--;
	$("#lives").children("span").text(livesRemaining);
}

function pause(){
	var icicles=$(".icicle");
	if(icicles.css("-webkit-animation-play-state")=="paused"){
		icicles.css("-webkit-animation-play-state","running");
	}
	else{
		icicles.css({"-webkit-animation-play-state":"paused"})
	}
}

function resetGame(){
	score=0;
	$("#score").children("span").text(0);
	livesRemaining=3;
	$("#lives").children("span").text(3);
	clearInterval(icicleInterval);
	$(".icicle").remove();
}

function updateHighScore() {
	if (lastScore>highScore){
		highScore=lastScore;
	}
}

function addHighScoreText() {
	newHeader = "Although you successfully dodged "+lastScore+" snowflakes, the vortex has won again. A noble effort, kind adventurer.<br><br>Your high score was "+highScore+" snowflakes. Brr!<br><br>All bundled up with nowhere to go? Grab some hot chocolate and press the spacebar to brave the blizzard again. Come on, show that vortex that you really are the baddest snowman in town."
	$("#header").html(newHeader);
}

function playerColorRed() {
	$(".fa-umbrella").css("color","red");
	$("#lives").css("color","red");
}

function resetPlayerColor(){
	$(".fa-umbrella").css("color","#845dad");
	$("#lives").css("color","#6a7484");
}

$(document).ready(function(){
	resetGame();
	//var snowflakes = new Snowflakes("body","sn");
	//snowflakes.create(15);
	$(window).on("keydown",function(e){
		if(leftKeys.indexOf(e.which)!=-1){
			movePlayerLeft();
		}
		else if(rightKeys.indexOf(e.which)!=-1){
			movePlayerRight();		
		}
		else if(startKeys.indexOf(e.which)!=-1){
			startNewGame();
			$("#gamespace-screen").css("z-index","0");
			clearInterval(clearIcicles);
		}
	});
	$("#gamespace").on("animationEnd webkitAnimationEnd",".icicle",function(){
		// icicle hits the bottom of gamespace
		var icicleLeftEdge=parseInt($(this).css("margin-left"),10)+1; // left side of icicle
		var icicleRightEdge=parseInt($(this).css("margin-left"),10)+parseInt($(this).width(),10)-1; // right side of icicle
		var playerLeftEdge=parseInt($("#player").css("margin-left"),10); // margin on left side of player
		var playerRightEdge=playerLeftEdge+parseInt($("#player").width(),10); // margin on right side of player
		if((icicleLeftEdge>=playerLeftEdge && icicleLeftEdge<=playerRightEdge) ||
			(icicleRightEdge>=playerLeftEdge && icicleRightEdge<=playerRightEdge)){ // player has been hit by icicle
			decreaseLives();
			if(livesRemaining<=0){
				lastScore=score;
				updateHighScore();
				resetGame();
				$("#gamespace-screen").css("z-index","1");
				clearIcicles=setInterval("clearIcicle()",50);
				addHighScoreText();
			}
			else {
				playerColorRed();
				setTimeout("resetPlayerColor()",80);
				setTimeout("playerColorRed()",160);
				setTimeout("resetPlayerColor()",210);
				$(this).remove();
				setTimeout("dropIcicle()",randomTimeDelay());
			}
		}
		else{
			increaseScore();
			$(this).remove();
			setTimeout("dropIcicle()",randomTimeDelay());
		}

	})
});	