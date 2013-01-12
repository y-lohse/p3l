var P3lSounds = {
	loaded: false,
	duplicates: 5,
	paddleSound: null,
	paddleSounds: [],
	init: function(){
		var audiotest = new Audio();
		var format = (audiotest.canPlayType('audio/mpeg')) ? 'mp3' : 'wav';
		
		var loadingSet = new Cannon.LoadingSet(Cannon.Utils.bind(function(){
			this.loaded = true;
		}, this), 1);
		
		this.paddleSound = new Audio('sounds/0.'+format);
		loadingSet.add(this.paddleSound);
		this.paddleSound.addEventListener('canplaythrough', Cannon.Utils.bind(function(){
			loadingSet.ready(this.paddleSound);
			
			for (var i = 0; i < this.duplicates; i++){
				this.paddleSounds.push(new Audio('sounds/0.'+format));
			}
			this.paddleSound = 0;
		}, this), false);
		this.paddleSound.load();
	},
	playSound: function(sound){
		if (!this.loaded) return;
		
		this.paddleSounds[this.paddleSound].currentTime = 0;
		this.paddleSounds[this.paddleSound].play();
		if (++this.paddleSound >= this.duplicates) this.paddleSound = 0;
	}
};