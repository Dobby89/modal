import { createElement, htmlToElement } from './utils';

function createModalElements(content) {

    if (content instanceof Node !== true) { // TODO: Don't clone, as this may break IDs and form elements for example
        content = htmlToElement(content);
    }

    const wrapper = createElement('div', { class: 'modal-container' });
    const overlay = createElement('div', { class: 'modal-overlay' });
    const modalContent = createElement('div', { class: 'modal-content' });
	const modalClose = createElement('button', { class: 'modal-close' }, 'Close');

	modalContent.appendChild(content);
	content.removeAttribute('style');
    wrapper.appendChild(overlay);
    wrapper.appendChild(modalClose);
    wrapper.appendChild(modalContent);

    return wrapper;
}

function showModal(modalEl) {
	modalEl.classList.add('open');
}

function insertModal(modalEl) {
    showModal(modalEl);
    document.body.appendChild(modalEl);
}

function closeButtonClicked(evt) {
	this.close();
}

function keyPressed(evt) {
	if ((evt.keyCode || evt.which) === 27) {
		modal.close();
	}
}

function attachEvents(modal) {
	const modalClose = modal.modal.querySelector('.modal-close');

	modalClose.addEventListener('click', modal.onCloseButtonClicked);
	window.addEventListener('keyup', modal.keyPressed);
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

		// TODO: Transition

        this.state = 'open';
		insertModal(this.modal);
        attachEvents(this);
		showModal(this.modal);
    }
}

Modal.prototype.close = function() {
	this.state = 'closed';

	// TODO: Transition and delete

	this.modal.classList.remove('open');
}
