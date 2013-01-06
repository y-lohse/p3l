Cannon.include('http://code.yannick-lohse.fr/cannon/1/display.js');
Cannon.include('http://code.yannick-lohse.fr/cannon/1/misc.js');
Cannon.include('http://code.yannick-lohse.fr/cannon/1/math.js');

var paddle, paddleCol = 0;
var GRAVITY = .4, 
	GUTTER_WIDTH = 100;

Cannon.onReady = function(){
	Cannon.Logger.autolog('logs');
	Cannon.use('*');
	
	Cannon.getScript('objects.js', function(){
		MCP.background = background;
		MCP.canvas = canvas;
		MCP.spawnPel();
	});
	
	var canvas = new Cannon.Canvas('canvas');
	
	var background = new Rectangle(0, 0, canvas.width, canvas.height);
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
	
	canvas.on('canvas:keydown', function(event){
		if (event.key === 'right' && paddleCol < 2)
			paddle.x = 25+GUTTER_WIDTH*++paddleCol;
		else if (event.key === 'left' && paddleCol > 0)
			paddle.x = 25+GUTTER_WIDTH*--paddleCol;
	});
};

function onRender(){
	var removeMe = [];
	for (var i = 0; i < MCP.pels.length; i++){
		var pel = MCP.pels[i];
		
		pel.direction.y = pel.direction.y+GRAVITY;
		
		pel.x += pel.direction.x;
		pel.y += pel.direction.y;
		
		if (pel.y >= paddle.y){
			if (paddleCol === pel.bounces){			
				pel.bounceOff(paddle.y);
				if (pel.bounces === 4) removeMe.push(pel);
			}
			else {
				
				removeMe.push(pel);
			}
		}
	}
	
	for (var i = 0; i < removeMe.length; i++){
		MCP.lostOne(removeMe[i]);
	}
}