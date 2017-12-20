import Modal from './js/modal';
import './scss/main.scss';

const modalOneTrigger = document.getElementById('modal-one-trigger');
const modalOneContent = document.getElementById('modal-one');
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
