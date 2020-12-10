let alreadyTested = false;
let passiveSupported = false;

const isSupported = () => {
	if (alreadyTested) return passiveSupported;
	alreadyTested = true;

	// Test via a getter in the options object to see if the passive property is accessed
	try {
		let opts = Object.defineProperty({}, 'passive', {
			get: () => {
				passiveSupported = true;
			}
		});
		window.addEventListener('test', null, opts);
	} catch (e) {
		return passiveSupported;
	}
	window.removeEventListener('test', null, opts);
	return passiveSupported;
};

const passiveEvent = () => {
	return isSupported() ? { passive: true } : false;
};

// DRAG AND DROP
let dropIcon;
const dragDropEvent = () => {
	dropIcon = $('#dropTarget');

	let dropArea = document.getElementById('threeWebGL');
	dropArea.addEventListener('drop', dropEvent, false);
	dropArea.addEventListener('dragover', dragOver, false);
}
// -- DROP EVENT: HANDLER
// ---------------------------------------------
function dropEvent(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	clearTimeout(dragReturnToNormal);
	dropIcon.removeClass('dropping');
	dragHasColor = false;

	let droppedFiles = evt.dataTransfer.files[0];
	let reader = new FileReader();
	reader.onload = function (event) {
		console.log(event.target.result);
	};
	reader.readAsDataURL(droppedFiles);
	return false;
}
// -- DRAG OVER DROPTARGET: HANDLER
// ---------------------------------------------
var dragReturnToNormal;
var dragHasColor = false;
function dragOver(evt) {
	clearTimeout(dragReturnToNormal);
	dragReturnToNormal = setTimeout(function () {
		dropIcon.removeClass('dropping');
		dragHasColor = false;
	}, 500);

	if (!dragHasColor) {
		dropIcon.addClass('dropping');
		dragHasColor = true;
	}

	evt.stopPropagation();
	evt.preventDefault();
	return false;
}


export { passiveEvent, dragDropEvent };