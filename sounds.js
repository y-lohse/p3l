var P3lSounds = {
	duplicates: 5,
	soundIndexes: [0, 0, 0, 0],
	sounds: [[], [], [], []],
	init: function(){
		var audiotest = new Audio();
		var format = (audiotest.canPlayType('audio/mpeg')) ? 'mp3' : 'wav';
		
		var paddleSound = new Audio('sounds/paddle.'+format);
		paddleSound.addEventListener('canplaythrough', Cannon.Utils.bind(function(){
			for (var i = 0; i < this.duplicates; i++){
				this.sounds[3].push(new Audio(paddleSound.src));
			}
		}, this), false);
		paddleSound.load();
		
		for (var i = 0; i < 3; i++){
			var bounceSound = new Audio('sounds/'+i+'.'+format);
			bounceSound.addEventListener('canplaythrough', Cannon.Utils.bind(function(index){
				for (var j = 0; j < this.duplicates; j++){
					this.sounds[index].push(new Audio('sounds/'+index+'.'+format));
				}
			}, this, i), false);
			bounceSound.load();
		}
	},
	playSound: function(sound){
		//sound = 1;
		//Cannon.Logger.log(this.sounds[sound].length);
		this.sounds[sound][this.soundIndexes[sound]].currentTime = 0;
		this.sounds[sound][this.soundIndexes[sound]].play();
		if (++this.soundIndexes[sound] >= this.duplicates) this.soundIndexes[sound] = 0;
	}
};