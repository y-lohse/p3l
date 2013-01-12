Cannon.include('http://code.yannick-lohse.fr/cannon/1/display.js');
Cannon.include('http://code.yannick-lohse.fr/cannon/1/misc.js');
Cannon.include('http://code.yannick-lohse.fr/cannon/1/math.js');

var canvas, paddle, paddleCol = 0;
var GRAVITY = .2, 
	GUTTER_WIDTH = 100,
	PADDING = 25,
	PEL_MAX_SPEED = 8,
	TEXT_COLOR = '#76777d',
	FADED_COLOR = '#babbc1';

Cannon.onReady = function(){
	Cannon.Logger.maxlog = 20;
	Cannon.Logger.autolog('logs');
	Cannon.use('*');
	
	Cannon.getScript('sounds.js', function(){
		P3lSounds.init();
	});
	Cannon.getScript('engine.js', function(){
		P3lEngine.background = background;
		P3lEngine.canvas = canvas;
		P3lEngine.scoreText = scoreText;
		P3lEngine.lifesObjects.push(l1);
		P3lEngine.lifesObjects.push(l2);
		P3lEngine.lifesObjects.push(l3);
		
		canvas.on('canvas:render', onRender);
	});
	
	if (localStorage.getItem('highscore') == null) localStorage.setItem('highscore', 0);
	
	canvas = new Cannon.Canvas('canvas');
	
	var background = new Rectangle(0, 0, canvas.width, canvas.height);
	background.fillStyle = new Color(209, 210, 215);
	canvas.addChild(background);
	background.fillStyle = new Color('#d1d2d7');
	background.lineWidth = 0;
	
	var gradient = new RadialGradient(canvas.width/2);
	gradient.addColorStop(0, '#e2e3e6').addColorStop(1, new Color(209, 210, 215, 0));
	
	var grad = new Rectangle(0, 0, canvas.width, canvas.height);
	grad.fillStyle = new Color(209, 210, 215);
	canvas.addChild(grad);
	grad.fillStyle = gradient;
	grad.lineWidth = 0;
	
	paddle = new Rectangle(25, canvas.height-20, 100, 10);
	canvas.addChild(paddle);
	paddle.fillStyle = '#4e4f53';
	paddle.strokeStyle = '#4e4f53';
	
	var l1 = new Circle(canvas.width/2-40, 170, 10);
	canvas.addChild(l1);
	var l2 = new Circle(canvas.width/2, 170, 10);
	canvas.addChild(l2);
	var l3 = new Circle(canvas.width/2+40, 170, 10);
	canvas.addChild(l3);
	l1.fillStyle = l2.fillStyle = l3.fillStyle = FADED_COLOR;
	l1.strokeStyle = l2.strokeStyle = l3.strokeStyle = FADED_COLOR;
	l1.visible = l2.visible = l3.visible = false;
	
	titleText = new DynamicText('p3l', 0, 50);
	titleText.setFont('arial', 80, '');
	canvas.addChild(titleText);
	titleText.x = canvas.width/2 - titleText.getWidth()/2;
	titleText.fillStyle = new Color(TEXT_COLOR);
	
	scoreText = new DynamicText('0', 0, 200);
	scoreText.setFont('arial', 90, '');
	canvas.addChild(scoreText);
	scoreText.x = canvas.width/2 - scoreText.getWidth()/2;
	scoreText.fillStyle = new Color(FADED_COLOR);
	scoreText.fillStyle.a = 0;
	
	click = new DynamicText('click anywhere to start', 0, 300);
	click.setFont('arial', 30, '');
	canvas.addChild(click);
	click.fillStyle = new Color(TEXT_COLOR);
	click.x = canvas.width/2 - click.getWidth()/2;
	
	explain1 = new DynamicText("Don't let the PELs fall", 0, 170);
	explain1.setFont('arial', 20, '');
	canvas.addChild(explain1);
	explain1.fillStyle = new Color(TEXT_COLOR);
	explain1.x = canvas.width/2 - explain1.getWidth()/2;
	
	explain2 = new DynamicText("Use the arrow keys to move", 0, 200);
	explain2.setFont('arial', 20, '');
	canvas.addChild(explain2);
	explain2.fillStyle = new Color(TEXT_COLOR);
	explain2.x = canvas.width/2 - explain2.getWidth()/2;
	
	highscoreText = new DynamicText("Highscore : "+localStorage.getItem('highscore'), 0, 350);
	highscoreText.setFont('arial', 20, '');
	canvas.addChild(highscoreText);
	highscoreText.fillStyle = new Color(TEXT_COLOR);
	highscoreText.x = canvas.width/2 - highscoreText.getWidth()/2;

	lastscore = new DynamicText("Last game : 0", 0, 380);
	lastscore.setFont('arial', 20, '');
	canvas.addChild(lastscore);
	lastscore.fillStyle = new Color(0,0,0,0);
	
	canvas.on('canvas:click', function(){
		if (!P3lEngine.running){
			startGame()
		}
	});
	
	canvas.on('canvas:keydown', function(event){
		if (event.key === 'right' && paddleCol < 2){
			P3lSounds.playSound();
			paddle.x = PADDING+GUTTER_WIDTH*++paddleCol;
		}
		else if (event.key === 'left' && paddleCol > 0){
			P3lSounds.playSound();
			paddle.x = PADDING+GUTTER_WIDTH*--paddleCol;
		}
	});
};

function startGame(){
	P3lEngine.level = 1;
	P3lEngine.score = 0;
	P3lEngine.lifes = 3;
	P3lEngine.running = true;
	P3lEngine.startSpawning();
	
	var transparent = new Color(0,0,0,0);
	
	Tween.create(click, {fillStyle: transparent}, 500);
	Tween.create(explain1, {fillStyle: transparent}, 500);
	Tween.create(explain2, {fillStyle: transparent}, 500);
	Tween.create(highscoreText, {fillStyle: transparent}, 500);
	Tween.create(lastscore, {fillStyle: transparent}, 500);
	Tween.create(titleText, {fillStyle: FADED_COLOR}, 500);
	Tween.create(scoreText, {fillStyle: FADED_COLOR}, 500);
	
	for (var i = 0; i < P3lEngine.lifesObjects.length; i++) P3lEngine.lifesObjects[i].visible = true;
}

function endGame(score){
	if (localStorage.getItem('highscore') < score) localStorage.setItem('highscore', score);
	
	highscoreText.text = 'Highscore: '+localStorage.getItem('highscore');
	lastscore.text = 'Last game : '+score;
	
	highscoreText.x = canvas.width/2 - highscoreText.getWidth()/2;
	lastscore.x = canvas.width/2 - lastscore.getWidth()/2;
	
	Tween.create(click, {fillStyle: TEXT_COLOR}, 500);titleText
	Tween.create(explain1, {fillStyle: TEXT_COLOR}, 500);
	Tween.create(explain2, {fillStyle: TEXT_COLOR}, 500);
	Tween.create(titleText, {fillStyle: TEXT_COLOR}, 500);
	Tween.create(highscoreText, {fillStyle: TEXT_COLOR}, 500);
	Tween.create(lastscore, {fillStyle: TEXT_COLOR}, 500);
	Tween.create(scoreText, {fillStyle: new Color(0,0,0,0)}, 500);
	
	for (var i = 0; i < P3lEngine.lifesObjects.length; i++) P3lEngine.lifesObjects[i].visible = false;
	
	while (P3lEngine.pels.length-1 > 0){//last pel will be removed later
		P3lEngine.removePel(P3lEngine.pels[1]);
	}
}

function onRender(){
	var removeMe = [];
	for (var i = 0; i < P3lEngine.pels.length; i++){
		var pel = P3lEngine.pels[i];
		pel.nextBounce--;
		
		pel.direction.y = Math.min(pel.direction.y+GRAVITY, PEL_MAX_SPEED);
		
		pel.x += pel.direction.x;
		pel.y += pel.direction.y;
		
		if (pel.y >= paddle.y){
			if (paddleCol === pel.bounces && pel.bounces < 3){
				//bounces off paddle
				pel.bounceOff(paddle.y);
				P3lEngine.bounced();
				
				Tween.create(paddle, {fillStyle: '#828389', strokeStyle: '#828389'}, 250, function(){
					Tween.create(paddle, {fillStyle: '#4e4f53', strokeStyle: '#4e4f53'}, 250, 'easeOutQuint');
				}, 'easeOutQuint');
			}
			else if (pel.bounces < 3){
				//really lost a pel
				P3lEngine.lostOne();
				removeMe.push(pel);
			}
			else {
				//pel is away
				removeMe.push(pel);
			}
		}
	}
	
	for (var i = 0; i < removeMe.length; i++){
		P3lEngine.removePel(removeMe[i]);
	}
}