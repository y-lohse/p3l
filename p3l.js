Cannon.include('http://code.yannick-lohse.fr/cannon/1/display.js');
Cannon.include('http://code.yannick-lohse.fr/cannon/1/misc.js');
Cannon.include('http://code.yannick-lohse.fr/cannon/1/math.js');

var canvas, background;
var paddle, paddleCol = 0, pels = [];
var GRAVITY = .4, 
	GUTTER_WIDTH = 100;

Cannon.onReady = function(){
	Cannon.Logger.autolog('logs');
	Cannon.use('*');
	
	Cannon.getScript('objects.js', init);
	
	canvas = new Cannon.Canvas('canvas');
	
	background = new Rectangle(0, 0, canvas.width, canvas.height);
	background.fillStyle = new Color(209, 210, 215);
	canvas.addChild(background);
	
	paddle = new Rectangle(25, canvas.height-20, 100, 10);
	canvas.addChild(paddle);
	paddle.fillStyle = '#4e4f53';
	paddle.strokeStyle = '#4e4f53';
	
	var titleText = new DynamicText('p3l', 0, 50);
	titleText.setFont('arial', 80, '');
	canvas.addChild(titleText);
	titleText.x = canvas.width/2 - titleText.getWidth()/2;
	titleText.fillStyle = '#babbc1';
	
	canvas.on('canvas:render', onRender);
	
	
};

function onRender(){
	var removeMe = [];
	
	for (var i = 0; i < pels.length; i++){
		var pel = pels[i];
		
		pel.direction.y = pel.direction.y+GRAVITY;
		
		pel.x += pel.direction.x;
		pel.y += pel.direction.y;
		
		if (pel.y >= paddle.y){
			pel.bounceOff(paddle.y);

			if (pel.bounces === 4) removeMe.push(pel);
		}
	}
	
	for (var i = 0; i < removeMe.length; i++){
		pels = Cannon.Utils.arrayWithout(pels, removeMe[i]);
		canvas.removeChild(removeMe[i]);
	}
}

function predict(y, vectorY){
	var counter = 0;
	
	do{
		vectorY += GRAVITY;
		y += vectorY;
		counter++;
	}
	while(y < paddle.y);
	
	return counter;
}

function init(){
	var pel = new P3l(75, 50);
	canvas.addChild(pel);
	pels.push(pel);
}