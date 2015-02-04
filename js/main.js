var gen_initial_max_size = 5;
var gen_initial_max_rand = 10;
var gen_nr_ops = 5;
var time = 300;

setInterval(function () {
	if(time >= 0)
		time = time - 1;
	$("#time").text(time);
	if(time <= 10) {
		$("#player-time .btn").addClass("btn-danger");
	}
	if(time == 0) {
		if (confirm("Game over! \nYou have earned " + score + " points. \nWell done!\n\nWant to play again?")) { 
			location.reload();
		} 
		else { 
			alert('Good bye!') 
		};
	}
	if(time < 0) {
		$("#new-game").hide();
		$("#player-score").hide();
		$("#player-time").hide();
		$("#restart-game").show();
	}
}, 1000);

var currentStack = new StackOps();
var is_same = false;
var currentGameStack = [];
var finalGameStack = [];
var win = 0;
var score = 0;
var val = 0;
var moves = 0;

function generateInitialStack(stack) {
	$("#current-stack-list").html("");
	var initialList = "";
	for(i=0; i<stack.initial.length; i++) {
		initialList = initialList + "<a class='list-group-item color" + stack.initial[i] + "'><span>" + stack.initial[i] + "</span></a>";
	}
	$("#current-stack-list").html(initialList);
}

function generateFinalStack(stack) {
	$("#final-stack-list").html("");
	var finalList = "";
	for(i=0; i<stack.internal_stack.length(); i++) {
		finalList = finalList + "<a class='list-group-item color" + stack.internal_stack.get(i) + "'><span>" + stack.internal_stack.get(i) + "</span></a>";
		finalGameStack.push(stack.internal_stack.get(i));
	}
	$("#final-stack-list").html(finalList);
}

function updateScore(val) {
	score = score + val;
	$("#score").text(score);
}

function runOp(op) {
	var currentList = "";
	currentGameStack.length = 0;
	opname = currentStack.ops[op];
	
	currentStack[opname]();
	
	for(i=0; i<currentStack.length(); i++) {
		currentList = currentList + "<a class='list-group-item color" + currentStack.get(i) + "'><span>" + currentStack.get(i) + "</span></a>";
		currentGameStack.push(currentStack.get(i));
	}
	$("#current-stack-list").html("").html(currentList);
	
	is_same = (currentGameStack.length == finalGameStack.length) && currentGameStack.every(function(element, index) {
		return element === finalGameStack[index]; 
	});
	
	moves++;
	
	if(is_same) {
		win = 1;
		val = 5;
		if(moves > gen_nr_ops)
			val = val - (moves - gen_nr_ops);
		else if(moves < gen_nr_ops) {
			val = val + (gen_nr_ops - moves);
			time = time + (gen_nr_ops - moves);
		}
		if(val < 1)
			val = 1;
		$("#points").text(val).fadeToggle(1000).fadeToggle(3000);
		updateScore(val);
		newGame(1);
	}
}

function newGame(win) {
	is_same = false;
	moves = 0;
	val = 0;
	finalGameStack.length = 0;
	currentGameStack.length = 0;
	
	if(win == 0) {
		if(score >= 3) {
			$("#points").text("-3").fadeToggle(1000).fadeToggle(2000);
			updateScore(-3);
		}
	}
	
	var genStack = new Generator();
	genStack.GenerateRandom(gen_initial_max_size, gen_initial_max_rand, gen_nr_ops);
	
	currentStack = new StackOps();
	
	currentStack.Init(genStack.initial);
	
	generateInitialStack(genStack);
	generateFinalStack(genStack);
}

function setGameSizes() {
	var contentHeight = $( window ).height() - 0;
	var gameContainerHeight = contentHeight - 67;
	var gameWindowHeight = gameContainerHeight - 20;
	var gameWindowPanelHeight = gameWindowHeight;
	var gameWindowPanelBodyHeight = gameWindowPanelHeight - 32;
	
	$("#content").height(contentHeight);
	$("#game-container").height(gameContainerHeight);
	$("#game-window").height(gameWindowHeight);
	$("#game-window .panel").height(gameWindowPanelHeight);
	$("#moves .panel-body").height(gameWindowPanelBodyHeight);
	$("#current-stack .panel-body").height(gameWindowPanelBodyHeight);
	$("#final-stack .panel-body").height(gameWindowPanelBodyHeight);
		
	setTimeout(function() {
		var stacksWidth = $( window ).width() - 107;
		var stackWidth = (stacksWidth - 10) / 2;
		var stackItemsWidth = stackWidth - 10;
		
		$("#stacks").width(stacksWidth);
		$("#current-stack").width(stackWidth);
		$("#final-stack").width(stackWidth);
    	$("#current-stack-list").width(stackItemsWidth);
		$("#final-stack-list").width(stackItemsWidth);
		
		$("#points").css("top",3);
		$("#points").css("left",118);
	}, 100);
}

$(function() {
	setGameSizes();
	imageUrl = "img/alex.jpg";
	$("#player-thumbnail").css("background-image","url(" + imageUrl + ")");
	
	newGame(1);
});
$( window ).resize(function() {
	setGameSizes();
});
