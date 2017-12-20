import Modal from './js/modal';
import './scss/main.scss';

const modalOneTrigger = document.getElementById('modal-one-trigger');
const modalOneContent = document.getElementById('modal-one');

// Test that event listeners are kept when an element is moved
modalOneContent.addEventListener('click', function (evt) {
	console.log('hover');
});

const modalOneInstance = new Modal({ content: modalOneContent });
modalOneTrigger.addEventListener('click', function (evt) {
    evt.preventDefault();
    modalOneInstance.open();
});

const modalTwoTrigger = document.getElementById('modal-two-trigger');
const modalTwoInstance = new Modal({ content: `<div>Second Modal</div>` });
modalTwoTrigger.addEventListener('click', function (evt) {
    evt.preventDefault();
    modalTwoInstance.open();
});
