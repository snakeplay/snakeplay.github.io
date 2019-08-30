// Snake Game by Crismari

const cvs = document.getElementById('game');
const ctx = cvs.getContext('2d');
if (! localStorage.getItem('maxScore') > 0) localStorage.setItem('maxScore', 0);
if (! localStorage.getItem('gameMode') > 0) localStorage.setItem('gameMode', 2);

// GET Images
const bg = new Image();
bg.src = 'img/bg_border.png';
const bg2 = new Image();
bg2.src = 'img/bg_net.png';

const imagesCount = 8;
const images = [];
for(let i = 1; i <= imagesCount; i++) {
	const foodImg = new Image();
	foodImg.src = 'img/food'+i+'.png';
	images.unshift(foodImg);
}

// GET Mp3
// const music1 = new Audio();
// music1.src = 'mp3/m1.mp3';
// const music2 = new Audio();
// music2.src = 'mp3/m2.mp3';

// Base variables
let game;
let gameActive = false;
let firstStart = true;
let paused = false;
let box = 32;
let fps = 60;
let speed = 1;
let score = 0;
let level = 1;
let di = 3;
let dir = di;
let dirr = di;
let snake = [];
if (localStorage.getItem('gameMode') == 1) {document.getElementById('easy').checked = true;if (fps !== 60 || speed !== 4) {fps = 60;speed = 4;}level = 1;}
if (localStorage.getItem('gameMode') == 2) {document.getElementById('medium').checked = true;if (fps !== 60 || speed !== 4) {fps = 60;speed = 4;}level = 2;}
if (localStorage.getItem('gameMode') == 3) {document.getElementById('hard').checked = true;if (fps !== 60 || speed !== 8) {fps = 60;speed = 8;}level = 3;}
function new_snake() {
	snake[0] = {
		x: 320,
		y: 320,
		z: true,
		a: 0,
		b: 0
	};
	snake[1] = {
		x: 288,
		y: 320,
		z: true,
		a: 0,
		b: 0
	};
} new_snake();
function isInt(n) {
   return n % 1 === 0;
}
let food = {};
function newFood() {
	food = {
		x: Math.floor((Math.random() * 17 + 1)) * 32,
		y: Math.floor((Math.random() * 15 + 3)) * 32,
		q: images[Math.floor(Math.random()*images.length)]
	};
	for(let i = 0; i < snake.length; i++) {
		if (food.x == snake[i].x && food.y == snake[i].y) newFood();
	}
}
newFood();
let enter = 0;

function randomScore(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}


function eatTail(type) {
	if (type == 1) {
		for(let i = 1; i < snake.length; i++) {
			if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) draw(i);
		}
	} 
	else {
		newFood();
		for(let i = 0; i < snake.length; i++) {
			if (food.x >= snake[i].x && food.x <= snake[i].x + 32 && food.y >= snake[i].y && food.y <= snake[i].y + 32) eatTail(2);
		}
	}
}

function hideInGame() {
	if (gameActive === true) document.getElementById('settings').style.visibility = 'hidden';
	else document.getElementById('settings').style.visibility = 'visible';
}
let frames = 0;
let el = document.getElementById('f');
let inter = false;
function calc_fps() {
	el.innerHTML = frames;
	frames = 0;
}
function draw(over) {
	ctx.drawImage(bg2, 32, 96);
	ctx.drawImage(food.q, food.x, food.y);

	let nth = 1;
	for(let i = 0; i < snake.length; i++) {
		if (over > 0 && i == over) {
			if (nth == 1) {ctx.fillStyle = 'red';nth = 2;}
			else {ctx.fillStyle = 'red';nth = 1;}
		} else {
			if (nth == 1) {ctx.fillStyle = '#3f51b5';nth = 2;}
			else {ctx.fillStyle = '#4caf50';nth = 1;}
		}
		if (i == 0) ctx.fillStyle = '#2196f3';
		ctx.strokeStyle = '#1fa207';
		ctx.lineWidth = 3;

		if (! over > 0) {
			if (snake[i].z === true) {
				if (i > 0) {
		 			if (level === 1 && snake[i-1].a > 0) {
		 				if (i > 0 && Math.abs(snake[i].x - snake[i-1].x) > 64 || i > 0 && Math.abs(snake[i].y - snake[i-1].y) > 64) {
							if (snake[i-1].x < 32) {
								if (snake[i-1].y == 96) snake[i-1].b = 4;
								else snake[i-1].b = 2;
							}
							if (snake[i-1].x > 544) {
								if (snake[i-1].y == 96) snake[i-1].b = 4;
								else snake[i-1].b = 2;
							}
							if (snake[i-1].y < 96) {
								if (snake[i-1].x == 32) snake[i-1].b = 3;
								else snake[i-1].b = 1;
							}
							if (snake[i-1].y > 544) {
								if (snake[i-1].x == 32) snake[i-1].b = 3;
								else snake[i-1].b = 1;
							}
						}

	 					if (snake[i-1].b === 0) {
	 						if (snake[i-1].a === 1) {
			 					if      (snake[i].x > snake[i-1].x && snake[i].y > snake[i-1].y) { // 1 + 2
					 				if (! isInt(snake[i-1].x / 32) || ! isInt(snake[i].y / 32)) snake[i].y -= speed;
					 				else snake[i].x -= speed;
					 			}
					 			else if (snake[i].y < snake[i-1].y && snake[i].x > snake[i-1].x) { // 1 + 4
					 				if (! isInt(snake[i-1].x / 32) || ! isInt(snake[i].y / 32)) snake[i].y += speed;
					 				else snake[i].x -= speed;
					 			}
					 			else if (! isInt(snake[i].y / 32)) {
					 				if (snake[i].y < snake[i-1].y) snake[i].y += speed;
					 				else snake[i].y -= speed;
					 			}
					 			else snake[i].x -= speed;
			 				}
			 				if (snake[i-1].a === 2) {
			 					if      (snake[i].x > snake[i-1].x && snake[i].y > snake[i-1].y) { // 1 + 2
					 				if (! isInt(snake[i-1].x / 32) || ! isInt(snake[i].y / 32)) snake[i].y -= speed;
					 				else snake[i].x -= speed;
					 			}
					 			else if (snake[i].y > snake[i-1].y && snake[i].x < snake[i-1].x) { // 3 + 2
					 				if (! isInt(snake[i-1].x / 32) || ! isInt(snake[i].y / 32)) snake[i].y -= speed;
					 				else snake[i].x += speed;
					 			}
					 			else if (! isInt(snake[i].x / 32)) {
					 				if (snake[i].x < snake[i-1].x) snake[i].x += speed;
					 				else snake[i].x -= speed;
					 			}
					 			else snake[i].y -= speed;
			 				}
			 				if (snake[i-1].a === 3) {
			 					if (snake[i].y > snake[i-1].y && snake[i].x < snake[i-1].x) { // 3 + 2
					 				if (! isInt(snake[i-1].x / 32) || ! isInt(snake[i].y / 32)) snake[i].y -= speed;
					 				else snake[i].x += speed;
					 			}
					 			else if (snake[i].x < snake[i-1].x && snake[i].y < snake[i-1].y) { // 3 + 4
					 				if (! isInt(snake[i-1].x / 32) || ! isInt(snake[i].y / 32)) snake[i].y += speed;
					 				else snake[i].x += speed;
					 			}
					 			else if (! isInt(snake[i].y / 32)) {
					 				if (snake[i].y < snake[i-1].y) snake[i].y += speed;
					 				else snake[i].y -= speed;
					 			}
					 			else snake[i].x += speed;
			 				}
			 				if (snake[i-1].a === 4) {
			 					if (snake[i].x < snake[i-1].x && snake[i].y < snake[i-1].y) { // 3 + 4
					 				if (! isInt(snake[i-1].x / 32) || ! isInt(snake[i].y / 32)) snake[i].y += speed;
					 				else snake[i].x += speed;
					 			}
					 			else if (snake[i].y < snake[i-1].y && snake[i].x > snake[i-1].x) { // 1 + 4
					 				if (! isInt(snake[i-1].x / 32) || ! isInt(snake[i].y / 32)) snake[i].y += speed;
					 				else snake[i].x -= speed;
					 			}
					 			else if (! isInt(snake[i].x / 32)) {
					 				if (snake[i].x < snake[i-1].x) snake[i].x += speed;
					 				else snake[i].x -= speed;
					 			}
					 			else snake[i].y += speed;
			 				}
	 					}
	 					else {
	 						if (snake[i-1].b === 1) snake[i].x -= speed;
		 					if (snake[i-1].b === 3) snake[i].x += speed;
		 					if (snake[i-1].b === 2) snake[i].y -= speed;
		 					if (snake[i-1].b === 4) snake[i].y += speed;
	 					}
		 			}
		 			else {
		 				if      (snake[i].x > snake[i-1].x && snake[i].y > snake[i-1].y) { // 1 + 2
			 				if (! isInt(snake[i-1].x / 32) || ! isInt(snake[i].y / 32)) snake[i].y -= speed;
			 				else snake[i].x -= speed;
			 			}
			 			else if (snake[i].y > snake[i-1].y && snake[i].x < snake[i-1].x) { // 3 + 2
			 				if (! isInt(snake[i-1].x / 32) || ! isInt(snake[i].y / 32)) snake[i].y -= speed;
			 				else snake[i].x += speed;
			 			}
			 			else if (snake[i].x < snake[i-1].x && snake[i].y < snake[i-1].y) { // 3 + 4
			 				if (! isInt(snake[i-1].x / 32) || ! isInt(snake[i].y / 32)) snake[i].y += speed;
			 				else snake[i].x += speed;
			 			}
			 			else if (snake[i].y < snake[i-1].y && snake[i].x > snake[i-1].x) { // 1 + 4
			 				if (! isInt(snake[i-1].x / 32) || ! isInt(snake[i].y / 32)) snake[i].y += speed;
			 				else snake[i].x -= speed;
			 			}
			 			else if (snake[i].x > snake[i-1].x) snake[i].x -= speed; // 1
						else if (snake[i].y > snake[i-1].y) snake[i].y -= speed; // 2
						else if (snake[i].x < snake[i-1].x) snake[i].x += speed; // 3
						else if (snake[i].y < snake[i-1].y) snake[i].y += speed; // 4
		 			}
				}
				else {
					if      (dir == 1) snake[0].x -= speed;
					else if (dir == 2) snake[0].y -= speed;
					else if (dir == 3) snake[0].x += speed;
					else if (dir == 4) snake[0].y += speed;
				}
				if (level === 1) {
					if (snake[i].x < 32) {
						if ((32 - snake[i].x) >= 32) {
							snake[i].x = 544;
							if (i !== 0) {
								if (snake[i-1].b === 0) snake[i-1].a = 0;
								else snake[i-1].b = 0;
							}
							if (i == snake.length - 1) {
								if (snake[i].b === 0) snake[i].a = 0;
								else snake[i-1].b = 0;
							}
						} else {
							if (snake[i].x != 1) snake[i].a = 1;
							ctx.fillRect(snake[i].x + 544, snake[i].y, 32, 32);
						}
					}
					if (snake[i].x > 544) {
						if ((snake[i].x - 544) >= 32) {
							snake[i].x = 32;
							if (i !== 0) {
								if (snake[i-1].b === 0) snake[i-1].a = 0;
								else snake[i-1].b = 0;
							}
							if (i == snake.length - 1) {
								if (snake[i].b === 0) snake[i].a = 0;
								else snake[i-1].b = 0;
							}
						} else {
							if (snake[i].x != 3) snake[i].a = 3;
							ctx.fillRect(snake[i].x - 544, snake[i].y, 32, 32);
						}
					}
					if (snake[i].y < 96) {
						if ((96 - snake[i].y) >= 32) {
							snake[i].y = 544;
							if (i !== 0) {
								if (snake[i-1].b === 0) snake[i-1].a = 0;
								else snake[i-1].b = 0;
							}
							if (i == snake.length - 1) {
								if (snake[i].b === 0) snake[i].a = 0;
								else snake[i-1].b = 0;
							}
						} else {
							if (snake[i].x != 2) snake[i].a = 2;
							ctx.fillRect(snake[i].x, snake[i].y + 480, 32, 32);
						}
					}
					if (snake[i].y > 544) {
						if ((snake[i].y - 544) >= 32) {
							snake[i].y = 96;
							if (i !== 0) {
								if (snake[i-1].b === 0) snake[i-1].a = 0;
								else snake[i-1].b = 0;
							}
							if (i == snake.length - 1) {
								if (snake[i].b === 0) snake[i].a = 0;
								else snake[i-1].b = 0;
							}
						} else {
							if (snake[i].x != 4) snake[i].a = 4;
							ctx.fillRect(snake[i].x, snake[i].y - 480, 32, 32);
						}
					}
				}
				if (level === 2) {
					if(snake[i].x < 32 || snake[i].x > 544 || snake[i].y < 96 || snake[i].y > 544) gameover();
				}
				if (level === 3) {
					if(snake[i].x < 32 || snake[i].x > 544 || snake[i].y < 96 || snake[i].y > 544) gameover();
				}
			} else {
				snake[i].z += speed;
				if (snake[i].z == 32) snake[i].z = true;
			}
		}
		ctx.fillRect(snake[i].x, snake[i].y, 32, 32);
		//ctx.strokeRect(snake[i].x, snake[i].y, 32, 32);
	}
	ctx.drawImage(bg, 0, 0);
	ctx.fillStyle = 'white';
	ctx.font = '50px Arial';
	if (localStorage.getItem('modeScore') === null) localStorage.setItem('modeScore','');
	ctx.fillText(score+' / '+localStorage.getItem('maxScore')+' '+localStorage.getItem('modeScore'), 80, 54);
	if (over > 0) {gameover();return false;}

	if (isInt(snake[0].x / 32) && isInt(snake[0].y / 32)) {
		eatTail(1);
		dir = dirr;
		if (snake[0].x == food.x && snake[0].y == food.y) {
			snake.push({
				x: snake[snake.length-1].x,
				y: snake[snake.length-1].y,
				z: 0,
				a: 0,
				b: 0
			});
			eatTail(2);
			score++;
			if (score > localStorage.getItem('maxScore')) {
				localStorage.setItem('maxScore', score);
				if (level === 1) localStorage.setItem('modeScore','(Easy)');
				if (level === 2) localStorage.setItem('modeScore','(Medium)');
				if (level === 3) localStorage.setItem('modeScore','(Hard)');
			}
		}
	}
	frames++;
}
document.onkeydown = function(event) {
	if (event.keyCode == 37 && dir !== 3) 			dirr = 1;
	else if (event.keyCode == 38 && dir !== 4) dirr = 2;
	else if (event.keyCode == 39 && dir !== 1) dirr = 3;
	else if (event.keyCode == 40 && dir !== 2) dirr = 4;
}

function startDraw() {
	document.getElementById('play').blur();
	enter = 0;
	gameActive = true;
	hideInGame();
	if (firstStart === true) {
		firstStart = false;
		game = setInterval(draw, 1000/fps);
		inter = setInterval(calc_fps, 1000);
	}
}

function tab() {
	if (paused === false && gameActive === false) gameRestart();
	else pause();
}

function pause() {
	if (paused === false && gameActive === true) {
		clearInterval(game);
		clearInterval(inter);
		frames = 0;
		el.innerHTML = 0;
		gameActive = false;
		paused = true;
	} else if (paused === true && gameActive === false) {
		game = setInterval(draw, 1000/fps);
		inter = setInterval(calc_fps, 1000);
		gameActive = true;
		paused = false;
	}
}

function gameover() {
	clearInterval(game);
	clearInterval(inter);
	frames = 0;
	gameActive = false;
	hideInGame();
	const	gameOver = document.getElementById('gameover');
	gameOver.style.transform = 'translateY(0)';
	gameOver.style.opacity = '1';
	document.getElementById('score').innerHTML = 'Your score: '+score+'<br/>Your max score: '+localStorage.getItem('maxScore');
	enter = 1;
}

function gameRestart() {
	const	gameOver = document.getElementById('gameover');
	gameOver.style.opacity = '0';
	setTimeout(function(){gameOver.style.transform = 'translateY(-100%)';},500)
	score = 0;
	dir = di;
	dirr = di;
	snake = [];
	new_snake();
	enter = 0;
	gameActive = false;
	firstStart = true;
	el.innerHTML = 0;
	let nth = 0;
	ctx.drawImage(bg, 0, 0);
	ctx.drawImage(bg2, 32, 96);
	ctx.drawImage(food.q, food.x, food.y);
	ctx.fillStyle = 'white';
	ctx.font = '50px Arial';
	if (localStorage.getItem('modeScore') === null) localStorage.setItem('modeScore','');
	ctx.fillText(score+' / '+localStorage.getItem('maxScore')+' '+localStorage.getItem('modeScore'), 80, 54);
	for(let i = 0; i < snake.length; i++) {
		if (nth == 1) {ctx.fillStyle = '#4caf50';nth = 2;}
		else {ctx.fillStyle = '#3f51b5';nth = 1;}
		if (i == 0) ctx.fillStyle = '#2196f3';
		ctx.strokeStyle = '#1fa207';
		ctx.lineWidth = 3;
		ctx.fillRect(snake[i].x, snake[i].y, 32, 32);
	}
}
document.addEventListener('keyup', function(e){if(e.keyCode == 13 && enter == 1) tab()});

document.getElementById('easy').onclick = function(){localStorage.setItem('gameMode',1);level = 1;document.getElementById('easy').blur();if (fps !== 60 || speed !== 4) {fps = 60;speed = 4;}};
document.getElementById('medium').onclick = function(){localStorage.setItem('gameMode',2);level = 2;document.getElementById('medium').blur();if (fps !== 60 || speed !== 4) {fps = 60;speed = 4;}};
document.getElementById('hard').onclick = function(){localStorage.setItem('gameMode',3);level = 3;document.getElementById('hard').blur();if (fps !== 60 || speed !== 8) {fps = 60;speed = 8;}};
window.onload = function() {
	let nth = 0;
	ctx.drawImage(bg, 0, 0);
	ctx.drawImage(bg2, 32, 96);
	ctx.fillStyle = 'white';
	ctx.font = '50px Arial';
	if (localStorage.getItem('modeScore') === null) localStorage.setItem('modeScore','');
	ctx.fillText(score+' / '+localStorage.getItem('maxScore')+' '+localStorage.getItem('modeScore'), 80, 54);
	for(let i = 0; i < snake.length; i++) {
		if (nth == 1) {ctx.fillStyle = '#4caf50';nth = 2;}
		else {ctx.fillStyle = '#3f51b5';nth = 1;}
		if (i == 0) ctx.fillStyle = '#2196f3';
		ctx.strokeStyle = '#1fa207';
		ctx.lineWidth = 3;
		ctx.fillRect(snake[i].x, snake[i].y, 32, 32);
	}
	document.getElementById('game').focus();
	document.addEventListener("keydown", function(e){if(e.keyCode == 32){tab()}});
	document.addEventListener("keyup", function(e){if(firstStart === true && e.keyCode != 32){if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40){gameActive = true;startDraw()}}});
	
	// document.addEventListener("touchstart", tapHandler);

	// var tapedTwice = false;

	// function tapHandler(event) {
	//     if(!tapedTwice) {
	//         tapedTwice = true;
	//         setTimeout( function() { tapedTwice = false; }, 300 );
	//         return false;
	//     }
	//     tab();
	//  }

	document.addEventListener('touchstart', handleTouchStart, false);        
	document.addEventListener('touchmove', handleTouchMove, false);

	var xDown = null;                                                        
	var yDown = null;

	function getTouches(evt) {
	  return evt.touches ||             // browser API
	         evt.originalEvent.touches; // jQuery
	}                                                     

	function handleTouchStart(evt) {
	    const firstTouch = getTouches(evt)[0];                                      
	    xDown = firstTouch.clientX;                                      
	    yDown = firstTouch.clientY;                                      
	};                                                

	function handleTouchMove(evt) {
	    if ( ! xDown || ! yDown ) {
	        return;
	    }

	    var xUp = evt.touches[0].clientX;                                    
	    var yUp = evt.touches[0].clientY;

	    var xDiff = xDown - xUp;
	    var yDiff = yDown - yUp;

	    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
	        if ( xDiff > 0 ) {
	            /* left swipe */ 
	            if (dirr !== 3) dirr = 1;
	            if(firstStart === true) startDraw();
	        } else {
	            /* right swipe */
	            if (dirr !== 1) dirr = 3;
	            if(firstStart === true) startDraw();
	        }                       
	    } else {
	        if ( yDiff > 0 ) {
	            /* up swipe */ 
	            if (dirr !== 4) dirr = 2;
	            if(firstStart === true) startDraw();
	        } else { 
	            /* down swipe */
	            if (dirr !== 2) dirr = 4;
	            if(firstStart === true) startDraw();
	        }                                                                 
	    }
	    /* reset values */
	    xDown = null;
	    yDown = null;                                             
	};
}