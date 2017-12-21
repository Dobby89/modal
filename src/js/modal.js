import { createElement, htmlToFragment } from './utils';

function createModalElements(content) {

	if (typeof content === 'string') {
		content = htmlToFragment(content);
	}

	const wrapper = createElement('div', { class: 'modal-container' });
	const overlay = createElement('div', { class: 'modal-overlay' });
	const modalContent = createElement('div', { class: 'modal-content' });
	const modalClose = createElement('button', { class: 'modal-close' }, 'Close');

	if (content.removeAttribute) {
		content.removeAttribute('style');
	}

	modalContent.appendChild(content);
	wrapper.appendChild(overlay);
	wrapper.appendChild(modalClose);
	wrapper.appendChild(modalContent);

	return wrapper;
}

function closeButtonClicked(evt) {
	this.close();
}

function keyPressed(evt) {
	// Esc key
	if ((evt.keyCode || evt.which) === 27) {
		this.close();
	}
}

function attachEvents(modal) {
	const modalClose = modal.modal.querySelector('.modal-close');

	modalClose.addEventListener('click', modal.onCloseButtonClicked);
	window.addEventListener('keyup', modal.onKeyPressed);
}

export default function Modal(options = {}) {

	if (!options.content) {
		throw new Error('Modal expects a content property.');
		return;
	}

	this.state = 'closed';
	this.content = options.content;
	this.modal = createModalElements(this.content);
	this.onCloseButtonClicked = closeButtonClicked.bind(this);
	this.onKeyPressed = keyPressed.bind(this);
}

Modal.prototype.open = function() {
	if (this.state !== 'open') { // Prevent unnecessarily inserting to DOM

		// Transition open
		this.state = 'opening';
		document.body.appendChild(this.modal);
		attachEvents(this);

		setTimeout(() => {
			// Slight delay before adding class so opacity has chance to transition
			this.modal.classList.add('opening');
		}, 1);

		setTimeout(() => {
			this.state = 'open';
			this.modal.classList.remove('opening');
			this.modal.classList.add('open');
		}, 200);
	}
};

Modal.prototype.close = function() {
	if (this.state !== 'closed') {
		this.state = 'closing';

		// Transition close and remove from DOM
		this.modal.classList.add('closing');
		setTimeout(() => {
			this.state = 'closed';
			this.modal.classList.remove('open', 'closing');
			this.modal.parentNode.removeChild(this.modal);
		}, 200);
	}
};
