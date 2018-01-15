import Modal from './js/modal';
import './scss/main.scss';

const modalOneTrigger = document.getElementById('modal-one-trigger');
const modalOneContent = document.getElementById('modal-one');

// Test that event listeners are kept when an element is moved
modalOneContent.addEventListener('click', function(evt) {
	console.log('click');
});

const modalOneInstance = new Modal({ content: modalOneContent });
document.addEventListener('modal-opening', evt => {
	console.log('opening');
	console.log(evt);
});
document.addEventListener('modal-open', evt => {
	console.log('open');
	console.log(evt);
});
document.addEventListener('modal-closing', evt => {
	console.log('closing');
	console.log(evt);
});
document.addEventListener('modal-closed', evt => {
	console.log('closed');
	console.log(evt);
});
modalOneTrigger.addEventListener('click', function(evt) {
	evt.preventDefault();
	modalOneInstance.open();
});

const modalTwoTrigger = document.getElementById('modal-two-trigger');
const modalTwoInstance = new Modal({
	content: 'Second Modal',
	closeButton:
		'<button class="modal-close" aria-label="Close modal">Custom Close</button>' // Custom close markup
});
modalTwoTrigger.addEventListener('click', function(evt) {
	evt.preventDefault();
	modalTwoInstance.open();
});
