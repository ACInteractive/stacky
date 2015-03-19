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
var theme;
var secondaryGameOverText;
var userID;
var authType;
var playerName;

function resetVariables() {
	gen_initial_max_size = 5;
	gen_nr_ops = 5;
	time = 30;
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
	
	while(1) {
		var genStack = new Generator();
		genStack.GenerateRandom(gen_initial_max_size, gen_initial_max_rand, gen_nr_ops);
	
		currentStack = new StackOps();
		currentStack.Init(genStack.initial);
	
		is_same = (currentStack.stack.length == genStack.internal_stack.stack.length) && currentStack.stack.every(function(element, index) {
			return element === genStack.internal_stack.stack[index]; 
		});
		
		if (is_same == true) {
			continue;
		}
		else {
			break;
		}
	}
	
	generateInitialStack(genStack);
	generateFinalStack(genStack);
}

function setGameSizes() {
	var contentHeight = $( window ).height();
	var descriptionHeight = contentHeight - 40;
	var textHeight = contentHeight - 110;
	var gameContainerHeight = contentHeight - 72;
	var gameWindowHeight = gameContainerHeight - 20;
	var gameWindowPanelHeight = gameWindowHeight;
	var gameWindowPanelBodyHeight = gameWindowPanelHeight - 32;
	var stacksWidth = $( window ).width() - 107;
	var stackWidth = (stacksWidth - 10) / 2;
	var stackItemsWidth = stackWidth - 10;
	
	$("#first-page").height(contentHeight);
	$("#tutorial-page").height(contentHeight);
	$("#options-page").height(contentHeight);
	$("#highscores-page").height(contentHeight);
	$("#game-over-back-screen").height(contentHeight);
	$("#game-over-back-screen-play-again").height(gameContainerHeight + 10);
	$("#tutorial-description").height(descriptionHeight);
	$("#options-description").height(descriptionHeight);
	$("#highscores-description").height(descriptionHeight);
	$("#tutorial-text").height(textHeight);
	$("#options-text").height(textHeight);
	$("#highscores-text").height(textHeight);
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
	$("#game-over").css("top",(contentHeight - 356)/2);
}

function sortHighScores(scoreArray, userArray, currentScore, currentUser) {
    for(i=0; i<5; i++) {
		if(currentScore > scoreArray[i]) {
			for(j=4; j>i; j--) {
				scoreArray[j] = scoreArray[j-1];
				userArray[j] = userArray[j-1];
			}
			scoreArray[i] = currentScore;
			userArray[i] = currentUser;
			break;
		}
	}
}

function persistHighScores(u_temp, s_temp) {
	if(localStorage.getItem('hs') == 0)
		localStorage.setItem('hs','1');
					
	var hs_score = new Array();
	var hs_user = new Array();
	hs_score.length = 0;
	hs_user.length = 0;
	for(i=0;i<5;i++) {
		hs_score.push(parseInt(localStorage.getItem("s_"+i)));
		hs_user.push(localStorage.getItem("u_"+i));
	}
										
	sortHighScores(hs_score, hs_user, s_temp, u_temp);
					
	for(i=0;i<5;i++) {
		localStorage.setItem("s_"+i.toString(), hs_score[i].toString());
		localStorage.setItem("u_"+i.toString(), hs_user[i]);
	}
					
	var highscoreshtml = "";
	for(i=0;i<5;i++) {
		if (hs_score[i] == 0) {
			highscoreshtml = highscoreshtml + "<h4> " + (i+1) + "." + " </h4>";
		}
		else {
			highscoreshtml = highscoreshtml + "<h4> " + (i+1) + ". " + hs_user[i] + " <span class='user-score'>" + hs_score[i] + "</span></h4>";
		}
	}
	
	$("#highscores-container").html(highscoreshtml);
}
	
function postOnFacebook() {	
	facebookConnectPlugin.getLoginStatus(function(response) {
		if (response.status !== 'connected') {
			facebookConnectPlugin.login(["public_profile"],
				function (userData) {
					facebookConnectPlugin.getLoginStatus(
						function (status) {
						}
					);
				},
				function (error) { alert("Couldn't connect to Facebook!"); }
			);
		}
		var options = { method:"feed",
						picture:'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQmiVpPt8eDpoytmqaT1D10VlW4j1ydCWO-anBYHutU6E7bCRJw',
						name:'New Highscore',
						description: 'I just scored ' + score + ' points on Stacky!',
						caption: 'Do you think you can do better?'
					  };
					  
		facebookConnectPlugin.showDialog(options,
			function (result) {
				alert("Your score has been posted on your Facebook account.");
			},
			function (e) {
				
			}
		);
	});
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
				$("#game-over-back-screen").show();
				$("#game-over").show();
				if(score == 0)
					secondaryGameOverText = "Have you even tried?";
				else if(score > 0 && score <= 50)
					secondaryGameOverText = "Ok, is this your first game?";
				else if(score > 50 && score <= 100)
					secondaryGameOverText = "Not bad for a beginner!";
				else if(score > 100 && score <= 150)
					secondaryGameOverText = "Good job my friend!";
				else if(score > 150 && score <= 200)
					secondaryGameOverText = "Wow, you look like a pro!";
				else if(score > 200)
					secondaryGameOverText = "Amazing! You are some kind of a genius!";	
			
				$("#userscore").val(score);
				$("#game-over-text").html("<p>You have earned " + score + " points.</p><p>" + secondaryGameOverText + "</p>" );
				
				authType = localStorage.getItem("auth-type");
				if(authType == "1")
					$("#username").val(localStorage.getItem('player-name'));
				else
					$("#username").val(localStorage.getItem('player-name'));
				
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
	$('#game-over-back-screen-play-again').hide();
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

function setTheme() {
	/* 1 - Simple, 2 - Rainbow, 3 - Industrial */
	theme = localStorage.getItem("theme");
	
	if(theme == null)
		theme = "1";
	
	$("#theme-select").val(theme);
	
	$("#content").removeAttr("class");
	$("#content").addClass("theme-"+theme);
}

function setAuthenticationMethod() {
	/* 1 - Local Player, 2 - Facebook */
	authType = localStorage.getItem("auth-type");
	playerName = localStorage.getItem("player-name");
	
	if(authType == null) {
		localStorage.setItem("auth-type", "1");
		authType = "1";
	}
	
	$("#auth-select").val(authType);
		
	if(playerName == null) {
		localStorage.setItem("player-name", "Anonymous");
		playerName = "Anonymous";
	}
		
	$("#auth-user-input").val(playerName);
}

function changeAuthenticationOption() {
    var selectedAuthentication = $("#auth-select").val();
		
	if(selectedAuthentication == "2") {
		facebookConnectPlugin.getLoginStatus(function(response) {
			if (response.status !== 'connected') {
				facebookConnectPlugin.login(["public_profile"],
					function (userData) {
						facebookConnectPlugin.api('/me', null,
							function(response) {
								$("#auth-user-input").val(response.last_name);
							}
						);
					},
					function (error) { 
						$("#auth-select").val("1");
						alert("Couldn't connect to Facebook!");
					}
				);
			}
			else {
				facebookConnectPlugin.api('/me', null,
					function(response) {
						$("#auth-user-input").val(response.last_name);
					}
				);
			}
		});
		
	}
}

function saveOptions() {
	localStorage.setItem('theme', $("#theme-select").val());
	localStorage.setItem('auth-type', $("#auth-select").val());
	localStorage.setItem('player-name', $("#auth-user-input").val());
}

$(function() {		
	setTimeout(function() {
		setGameSizes();
	}, 1000);
	
	setTheme();
	setAuthenticationMethod();	

	$("#play-button").click( function() {
		$("#play-menu").show();
		$("#menu").hide();
	});
	
	$("#tutorial-button").click( function() {
		$("#tutorial-page").show();
		$("#first-page").hide();
	});
	
	$("#highscores-button").click( function() {
		$("#highscores-page").show();
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
		$("#highscores-page").hide();
		$("#options-page").hide();
		$("#play-menu").hide();
	});
	
	$("#back-button-options").click( function() {
		saveOptions();
		$("#first-page").show();
		$("#menu").show();
		$("#tutorial-page").hide();
		$("#highscores-page").hide();
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
	
	$("#theme-select").change( function() {
		localStorage.setItem("theme",$(this).val());
		setTheme();
	});
	
	if(localStorage.getItem('hs') != 1) {
		localStorage.setItem('hs','0');
		
		localStorage.setItem('s_0', '0');
		localStorage.setItem('s_1', '0');
		localStorage.setItem('s_2', '0');
		localStorage.setItem('s_3', '0');
		localStorage.setItem('s_4', '0');
		localStorage.setItem('s_5', '0');
		
		localStorage.setItem('u_0', '');
		localStorage.setItem('u_1', '');
		localStorage.setItem('u_2', '');
		localStorage.setItem('u_3', '');
		localStorage.setItem('u_4', '');
		localStorage.setItem('u_5', '');
	}
	
	var hs_score = new Array();
	var hs_user = new Array();
	hs_score.length = 0;
	for(i=0;i<5;i++) {
		hs_score.push(localStorage.getItem("s_"+i));
		hs_user.push(localStorage.getItem("u_"+i));
	}

	var highscoreshtml = "";
	for(i=0;i<5;i++) {
		if (hs_score[i] == 0) {
			highscoreshtml = highscoreshtml + "<h4> " + (i+1) + "." + " </h4>";
		}
		else {
			highscoreshtml = highscoreshtml + "<h4> " + (i+1) + ". " + hs_user[i] + " <span class='user-score'>" + hs_score[i] + "</span></h4>";
		}
	}
	
	$("#highscores-container").html(highscoreshtml);
	
	$("#reset-highcores").click( function() {
		localStorage.removeItem("hs");
		location.reload();
	});
	
	$("#reset-options").click( function() {
		localStorage.clear();
		location.reload();
	});
		
});
