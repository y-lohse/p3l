var P3lSounds = {
	duplicates: 5,
	paddleSound: 0,
	paddleSounds: [],
	init: function(){
		var audiotest = new Audio();
		var format = (audiotest.canPlayType('audio/mpeg')) ? 'mp3' : 'wav';
		
		var paddleSound = new Audio('sounds/paddle.'+format);
		paddleSound.addEventListener('canplaythrough', Cannon.Utils.bind(function(){
			for (var i = 0; i < this.duplicates; i++){
				this.paddleSounds.push(new Audio(paddleSound.src));
			}
		}, this), false);
		paddleSound.load();
		
		for (var i = 0; i < 3; i++){
			var bounceSound = new Audio('sounds/'+i+'.'+format);
			bounceSound.addEventListener('canplaythrough', Cannon.Utils.bind(function(){
				for (var i = 0; i < this.duplicates; i++){
					this.bounceSounds.push(new Audio('sounds/'+i+'.'+format));
				}
			}, this), false);
			bounceSound.load();
		}
	},
	playSound: function(sound){
		this.paddleSounds[this.paddleSound].currentTime = 0;
		this.paddleSounds[this.paddleSound].play();
		if (++this.paddleSound >= this.duplicates) this.paddleSound = 0;
	}
};