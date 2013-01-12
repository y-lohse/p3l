var P3lSounds = {
	loaded: false,
	paddleSound: null,
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
		}, this), false);
		this.paddleSound.load();
	},
	playSound: function(sound){
		if (!this.loaded) return;
		
		this.paddleSound.currentTime = 0;
		this.paddleSound.play();
	}
};