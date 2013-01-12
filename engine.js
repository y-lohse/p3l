var P3lEngine = {
		running: false,
		background: null,
		canvas: null,
		scoreText: null,
		pels: [],
		lifes: 3,
		lifesObjects: [],
		level: 1,
		score: 0,
		bounces: 0,
		timeout: null,
		maxDelay: 7000,
		minDelay: 1500,
		minSeparation: 30,
		bounced: function(){
			this.bounces++;
			this.level++;
			
			this.score += 1;
			this.scoreText.text = this.score;
			
			if (this.scoreText.getWidth() > this.canvas.width) this.scoreText.fontSize -= 5;
			this.scoreText.x = this.canvas.width/2 - this.scoreText.getWidth()/2;
		},
		lostOne: function(){
			Tween.create(this.background, {fillStyle: '#efafaf'}, 550, Cannon.Utils.bind(function(){
				Tween.create(this.background, {fillStyle: '#d1d2d7'}, 550, 'easeOutQuint');
			}, this), 'easeOutQuint');
			
			this.lifesObjects[this.lifes-1].visible = false;
			
			if (--this.lifes === 0){
				clearTimeout(this.timeout);
				this.running = false;
				endGame(this.score);
			}
		},
		startSpawning: function(){
			this.spawnPel();
			var nextPel = Math.max(((this.minDelay-this.maxDelay)/19 * (this.level-1) + this.maxDelay), this.minDelay);
			nextPel += Cannon.Math.Utils.randomIn(-500, 500);
			
			this.timeout = setTimeout(Cannon.Utils.bind(this.startSpawning, this), nextPel);
		},
		spawnPel: function(){
			var pel = new P3l(-25, paddle.y);
			this.setBounceFactor(pel);
			
			this.canvas.addChild(pel);
			this.pels.push(pel);
		},
		removePel: function(pel){
			this.pels = Cannon.Utils.arrayWithout(this.pels, pel);
			this.canvas.removeChild(pel);
		},
		setBounceFactor: function(pel){
			var bounce;
			var counter = 0;
			do{
				bounce = Cannon.Math.Utils.randomIn(-13, -9);
				pel.nextBounce = this.predict(pel.y, bounce, pel.y);
			}
			while(this.conflicts(pel) && ++counter <= 100);
			
			if (counter >= 100){
				bounce = bounce = Cannon.Math.Utils.randomIn(-9, -7);;
				pel.nextBounce = this.predict(pel.y, bounce, pel.y);
			}
			
			pel.direction.y = bounce;
			if (pel.bounces < 3) {
				pel.direction.x = GUTTER_WIDTH/this.predict(pel.y, pel.direction.y, pel.y);
			}
			else {
				pel.direction.x = 5;
				pel.nextBounce = Infinity;
			}
			
		},
		conflicts: function(pel){
			var pels = Cannon.Utils.cloneArray(this.pels);
			pels = Cannon.Utils.arrayWithout(pels, pel);
			
			for (var i = 0; i < pels.length; i++){
				if (Math.abs(pels[i].nextBounce-pel.nextBounce) < this.minSeparation) return true;
			}
			
			return false;
		},
		predict: function(y, vy, limit){
			//predicts the number of iterations before pel wil bounce again
			var counter = 0;
			
			do{
				vy = Math.min(vy+GRAVITY, PEL_MAX_SPEED);
				y += vy;
				counter++;
			}
			while(y < limit);
			
			return counter;
		},
};

var P3l = Cannon.Display.Circle.extend({
	__construct: function(x, y){
		this._super(false);
		this.x = (x || 0);
		this.y = (y || 0);
		this.radius = 5;
		
		this.bounces = 0;
		this.nextBounce = 0;
		
		this.direction= new Vector2D(0, 0);
	},
	bounceOff: function(limit){
		this.bounces++;
		this.y = limit;
		
		P3lEngine.setBounceFactor(this);
	},
});