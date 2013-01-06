var MCP = {
		running: false,
		background: null,
		canvas: null,
		scoreText: null,
		pels: [],
		lifes: 3,
		level: 1,
		score: 0,
		bounceFactors: [-7, -10, -13],
		previousBounce: 0,
		timeout: null,
		bounced: function(){
			this.score += this.level;
			this.scoreText.text = this.score;
			
			if (this.scoreText.getWidth() > this.canvas.width) this.scoreText.fontSize -= 5;
			this.scoreText.x = this.canvas.width/2 - this.scoreText.getWidth()/2;
		},
		lostOne: function(pel){
			this.pels = Cannon.Utils.arrayWithout(this.pels, pel);
			this.canvas.removeChild(pel);
			
			if (--this.lifes === 0){
				clearTimeout(this.timeout);
				this.running = false;
				endGame(this.score);
			}
		},
		startSpawning: function(){
			this.spawnPel();
			this.timeout = setTimeout(Cannon.Utils.bind(this.startSpawning, this), 2000);
		},
		spawnPel: function(){
			var pel = new P3l(-25, Cannon.Math.Utils.randomIn(25, 75));
			pel.direction.x = GUTTER_WIDTH/pel.predict(pel.y, pel.direction.y, paddle.y);
			
			this.canvas.addChild(pel);
			this.pels.push(pel);
		},
		getBounceFactor: function(){
			var bounce;
			do{
				bounce = Math.floor(Cannon.Math.Utils.randomIn(0, this.bounceFactors.length));
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