Cannon.include('http://code.yannick-lohse.fr/cannon/1/display.js');
Cannon.include('http://code.yannick-lohse.fr/cannon/1/misc.js');
Cannon.include('http://code.yannick-lohse.fr/cannon/1/math.js');

var canvas, paddle, paddleCol = 0;
var GRAVITY = .2, 
	GUTTER_WIDTH = 100,
	PADDING = 25,
	TEXT_COLOR = '#76777d',
	FADED_COLOR = '#babbc1';

Cannon.onReady = function(){
	Cannon.Logger.autolog('logs');
	Cannon.use('*');
	
	Cannon.getScript('objects.js', function(){
		MCP.background = background;
		MCP.canvas = canvas;
		MCP.scoreText = scoreText;
		
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
		if (!MCP.running){
			startGame()
		}
	});
	
	canvas.on('canvas:keydown', function(event){
		if (event.key === 'right' && paddleCol < 2)
			paddle.x = PADDING+GUTTER_WIDTH*++paddleCol;
		else if (event.key === 'left' && paddleCol > 0)
			paddle.x = PADDING+GUTTER_WIDTH*--paddleCol;
	});
};

function startGame(){
	MCP.level = 1;
	MCP.score = 0;
	MCP.lifes = 3;
	MCP.running = true;
	MCP.startSpawning();
	
	var transparent = new Color(0,0,0,0);
	
	Tween.create(click, {fillStyle: transparent}, 500);
	Tween.create(explain1, {fillStyle: transparent}, 500);
	Tween.create(explain2, {fillStyle: transparent}, 500);
	Tween.create(highscoreText, {fillStyle: transparent}, 500);
	Tween.create(lastscore, {fillStyle: transparent}, 500);
	Tween.create(titleText, {fillStyle: FADED_COLOR}, 500);
	Tween.create(scoreText, {fillStyle: FADED_COLOR}, 500);
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
}

function onRender(){
	var removeMe = [];
	for (var i = 0; i < MCP.pels.length; i++){
		var pel = MCP.pels[i];
		
		pel.direction.y += GRAVITY;
		
		pel.x += pel.direction.x;
		pel.y += pel.direction.y;
		
		if (pel.y >= paddle.y){
			if (paddleCol === pel.bounces && pel.bounces < 3){
				//bounces off paddle
				pel.bounceOff(paddle.y);
				MCP.bounced();
				
				Tween.create(paddle, {fillStyle: '#828389', strokeStyle: '#828389'}, 250, function(){
					Tween.create(paddle, {fillStyle: '#4e4f53', strokeStyle: '#4e4f53'}, 250, 'easeOutQuint');
				}, 'easeOutQuint');
			}
			else if (pel.bounces < 3){
				//really lost a pel
				MCP.lostOne();
				removeMe.push(pel);
			}
			else {
				//pel is away
				removeMe.push(pel);
			}
		}
	}
	
	for (var i = 0; i < removeMe.length; i++){
		MCP.removePel(removeMe[i]);
	}
}