var gameMode;
var gen_initial_max_rand;
var gen_initial_max_size;
var gen_nr_ops;
var time;
var currentStack;
var is_same;
var currentGameStack;
var finalGameStack;
var win;
var score;
var val;
var moves;

function resetVariables() {
	gen_initial_max_size = 5;
	gen_nr_ops = 5;
	time = 300;
	currentStack = new StackOps();
	is_same = false;
	currentGameStack = [];
	finalGameStack = [];
	win = 0;
	score = 0;
	val = 0;
	moves = 0;
}

resetVariables();

function generateInitialStack(stack) {
	$("#current-stack-list").empty();
	var initialList = "";
	for(i=0; i<stack.initial.length; i++) {
		initialList = initialList + "<a class='list-group-item color" + stack.initial[i] + "'><span>" + stack.initial[i] + "</span></a>";
	}
	$("#current-stack-list").html(initialList);
}

function generateFinalStack(stack) {
	$("#final-stack-list").empty();
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
	$("#current-stack-list").empty().html(currentList);
	
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
			if(gameMode == 3) {
				time = time + (gen_nr_ops - moves);
			}
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
	var contentHeight = $( window ).height();
	var descriptionHeight = contentHeight - 40;
	var textHeight = contentHeight - 110;
	var gameContainerHeight = contentHeight - 67;
	var gameWindowHeight = gameContainerHeight - 20;
	var gameWindowPanelHeight = gameWindowHeight;
	var gameWindowPanelBodyHeight = gameWindowPanelHeight - 32;
	var stacksWidth = $( window ).width() - 107;
	var stackWidth = (stacksWidth - 10) / 2;
	var stackItemsWidth = stackWidth - 10;
	
	$("#first-page").height(contentHeight);
	$("#tutorial-page").height(contentHeight);
	$("#options-page").height(contentHeight);
	$("#tutorial-description").height(descriptionHeight);
	$("#options-description").height(descriptionHeight);
	$("#tutorial-text").height(textHeight);
	$("#options-text").height(textHeight);
	$("#content").height(contentHeight);
	$("#game-container").height(gameContainerHeight);
	$("#game-window").height(gameWindowHeight);
	$("#game-window .panel").height(gameWindowPanelHeight);
	$("#moves .panel-body").height(gameWindowPanelBodyHeight);
	$("#current-stack .panel-body").height(gameWindowPanelBodyHeight);
	$("#final-stack .panel-body").height(gameWindowPanelBodyHeight);
	$("#stacks").width(stacksWidth);
	$("#current-stack").width(stackWidth);
	$("#final-stack").width(stackWidth);
	$("#current-stack-list").width(stackItemsWidth);
	$("#final-stack-list").width(stackItemsWidth);
	
	$("#points").css("top",3);
	$("#points").css("left",118);
}

function play(gameMode) {
	gameMode = gameMode;
	$("#first-page").hide();
	$("#content").show();
	
	if(gameMode == 1) {
		$(".secondary-ops").hide();
		gen_initial_max_rand = 6;
	} else
		gen_initial_max_rand = 10;
		
	if(gameMode == 3) {
		$("#back").hide();
		setInterval(function () {
			$("#time").text(time);
			if(time <= 10) {
				$("#player-time .btn").addClass("btn-danger");
			}
			if(time == 0) {
				if (confirm("Game over! \nYou have earned " + score + " points. \nWell done!\n\nWant to play again?")) { 
					reloadGame();
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
				$("#back").show();
			}
			if(time >= 0)
				time--;
		}, 1000);
	} else {
		$("#player-time").hide();
	}
	
	newGame(1);
}

function reloadGame() {
	resetVariables();
	$("#new-game").show();
	$("#player-score").show();
	updateScore(val);
	$("#player-time").show();
	$("#restart-game").hide();
	$("#back").hide();
	$("#show-time-button").hide();
	$("#time").text(time);
	$("#player-time .btn").removeClass("btn-danger");
	newGame(1);
}

function backToFirstPage() {
	location.reload();
}

$(function() {		
	setTimeout(function() {
		setGameSizes();
	}, 1000);
	
	$("#play-button").click( function() {
		$("#play-menu").show();
		$("#menu").hide();
	});
	
	$("#tutorial-button").click( function() {
		$("#tutorial-page").show();
		$("#first-page").hide();
	});
	
	$("#options-button").click( function() {
		$("#options-page").show();
		$("#first-page").hide();
	});
	
	$(".back-to-main-menu-button").click( function() {
		$("#first-page").show();
		$("#menu").show();
		$("#tutorial-page").hide();
		$("#options-page").hide();
		$("#play-menu").hide();
	});
	
	$(".hide-time").click( function() {
		$("#show-time-button").show();
		$("#back").show();
		$("#player-time").hide();
	});
	
	$("#show-time").click( function() {
		$("#show-time-button").hide();
		$("#back").hide();
		$("#player-time").show();
	});
});
