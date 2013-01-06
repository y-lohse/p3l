Cannon.include('http://code.yannick-lohse.fr/cannon/1/display.js');
Cannon.include('http://code.yannick-lohse.fr/cannon/1/misc.js');
Cannon.include('http://code.yannick-lohse.fr/cannon/1/math.js');

var paddle, paddleCol = 0;
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
	
	var canvas = new Cannon.Canvas('canvas');
	
	var background = new Rectangle(0, 0, canvas.width, canvas.height);
	background.fillStyle = new Color(209, 210, 215);
	canvas.addChild(background);
	
	var gradient = new RadialGradient(canvas.width/2);
	gradient.addColorStop(0, '#e2e3e6').addColorStop(1, '#d1d2d7');
	background.fillStyle = gradient;
	
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
	MCP.running = true;
	MCP.startSpawning();
	
	var transparent = new Color(0,0,0,0);
	
	Tween.create(click, {fillStyle: transparent}, 500);titleText
	Tween.create(explain1, {fillStyle: transparent}, 500);
	Tween.create(explain2, {fillStyle: transparent}, 500);
	Tween.create(titleText, {fillStyle: FADED_COLOR}, 500);
	Tween.create(scoreText, {fillStyle: FADED_COLOR}, 500);
}

function endGame(){
}

function onRender(){
	var removeMe = [];
	for (var i = 0; i < MCP.pels.length; i++){
		var pel = MCP.pels[i];
		
		pel.direction.y += GRAVITY;
		
		pel.x += pel.direction.x;
		pel.y += pel.direction.y;
		
		if (pel.y >= paddle.y){
			if (paddleCol === pel.bounces){			
				pel.bounceOff(paddle.y);
				MCP.bounced();
				if (pel.bounces === 4) removeMe.push(pel);
			}
			else removeMe.push(pel);
		}
	}
	
	for (var i = 0; i < removeMe.length; i++){
		MCP.lostOne(removeMe[i]);
	}
}