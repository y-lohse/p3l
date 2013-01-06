var MCP = {
		background: null,
		canvas: null,
		pels: [],
		lifes: 3,
		bounceFactors: [-7, -9, -11, -13],
		previousBounce: 0,
		lostOne: function(pel){
			this.pels = Cannon.Utils.arrayWithout(this.pels, pel);
			this.canvas.removeChild(pel);
			
			this.lifes--;
			//background.fillStyle = '#cc0000';
		},
		startSpawning: function(){
			MCP.spawnPel();
			setTimeout(arguments.callee.caller, 2000);
		},
		spawnPel: function(){
			var pel = new P3l(75, 50);
			this.canvas.addChild(pel);
			this.pels.push(pel);
		},
		getBounceFactor: function(){
			var bounce;
			do{
				bounce = Math.floor(Cannon.Math.Utils.randomIn(0, this.bounceFactors.length-1));
			}
			while(bounce === this.previousBounce);
			
			this.previousBounce = bounce;
			return this.bounceFactors[bounce];
		}
};

var P3l = Cannon.Display.Circle.extend({
	__construct: function(x, y){
		this._super(false);
		this.x = (x || 0);
		this.y = (y || 0);
		this.radius = 5;
		
		this.bounces = 0;
		
		this.direction= new Vector2D(0, 0);
	},
	bounceOff: function(limit){
		this.bounces++;
		this.y = limit;
		
		this.direction.y = MCP.getBounceFactor();
		if (this.bounces < 3) this.direction.x = GUTTER_WIDTH/this.predict(this.y, this.direction.y, limit);
		else this.direction.x = 5;
	},
	predict: function(y, vy, limit){
		var counter = 0;
		
		do{
			vy += GRAVITY;
			y += vy;
			counter++;
		}
		while(y < limit);
		
		return counter;
	}
});