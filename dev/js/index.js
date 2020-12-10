global.$ = require("jquery")

import ready from 'domready';

import App from './App';

ready(() => {
	window.app = new App();
	window.app.init();
});

// LOAD CSS FILES
// ------------------------------------
import '../css/style.css';
import '../css/responsive.css';
import '../css/fonts.css';
