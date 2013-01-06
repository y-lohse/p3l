var P3l = Cannon.Display.Circle.extend({
	__construct: function(x, y){
		this._super(false);
		this.x = (x || 0);
		this.y = (y || 0);
		this.radius = 5;
		
		this.bounces = 0;
		
		this.direction= new Vector2D(0, 0);
	},
	bounceOff: function(){
		this.bounces++;
		
		this.direction.y = Cannon.Math.Utils.randomIn(-19, -10);
		this.direction.x = GUTTER_WIDTH/this.predict(this.y, this.direction.y);
	},
	predict: function(y, vy){
		var counter = 0;
		
		do{
			vy += GRAVITY;
			y += vy;
			counter++;
		}
		while(y < paddle.y);
		
		return counter;
	}
});