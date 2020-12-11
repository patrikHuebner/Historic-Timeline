import TimelineApp from './TimelineApp/TimelineApp.js';

export default class App {

	constructor() {
		this.frameCount = 0;
		global.width = window.innerWidth;
		global.height = window.innerHeight;
	}

	init() {
		if (process.env.NODE_ENV == 'development') { }

		this.getHashVersion();
		this.addListeners();
		this.initTimelineApp();
		// this.animate();

		if (process.env.NODE_ENV == 'production') { }
	}



	getHashVersion() {
		$('#hashValue').html(VERSION);
	}






	addListeners() {
		// request animation frame
		this.handlerAnimate = this.animate.bind(this);

		// keypresses
		window.addEventListener('resize', this.resize.bind(this));
		window.addEventListener('keyup', this.keyup.bind(this));
	}



	animate() {
		this.render();
		this.raf = requestAnimationFrame(this.handlerAnimate);
	}



	initTimelineApp() {
		this.timelineApp = new TimelineApp(this);
	}




	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------



	render() {
		this.update();
		this.draw();
	}



	update() {
		//this.frameCount++;
	}


	
	draw() {
		// if (this.sketch) { this.sketch.update(); }
	}




	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		width = window.innerWidth;
		height = window.innerHeight;

		if (this.timelineApp) { this.timelineApp.resize(); }
	}



	keyup(e) {

	}



	click(e) {
		// console.log('Clicked');
	}



	getHashVersion() {
		$('#hashValue').html(VERSION);
	}


}
