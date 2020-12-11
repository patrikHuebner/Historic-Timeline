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

		if (process.env.NODE_ENV == 'production') { }
	}



	getHashVersion() {
		$('#hashValue').html(VERSION);
	}






	addListeners() {
		// keypresses
		window.addEventListener('resize', this.resize.bind(this));
		window.addEventListener('keyup', this.keyup.bind(this));
	}



	initTimelineApp() {
		this.timelineApp = new TimelineApp(this);
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
