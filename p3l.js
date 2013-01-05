Cannon.include('http://code.yannick-lohse.fr/cannon/1/display.js');

var canvas;

Cannon.onReady = function(){
	Cannon.Logger.autolog('logs');
	Cannon.use('*');
	
	canvas = new Cannon.Canvas('canvas');
};