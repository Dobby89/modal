import { createElement, createEvent, htmlToFragment, uniqueId } from './utils';

const stateString = {
	open: 'open',
	opening: 'opening',
	closed: 'closed',
	closing: 'closing'
};
const onOpening = createEvent('onOpening');
const onOpen = createEvent('onOpen');
const onClosing = createEvent('onClosing');
const onClosed = createEvent('onClosed');

function createModalElements(content, uid) {

	if (typeof content === 'string') {
		content = htmlToFragment(content);
	}

	const wrapper = createElement('div', { class: 'modal-container', 'data-modal-id': uid });
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

function overlayClicked(evt) {
	this.close();
}

function closeButtonClicked(evt) {
	this.close();
}

function keyPressed(evt) {
	// Check Esc key has been pressed
	if (typeof evt.keyCode !== 'undefined' && evt.keyCode && evt.keyCode !== 27) {
		return;
	}
	this.close();
}

function attachEvents(modal) {
	const modalClose = modal.modal.querySelector('.modal-close');
	const modalOverlay = modal.modal.querySelector('.modal-overlay');

	modalOverlay.addEventListener('click', modal.onOverlayClicked);
	modalClose.addEventListener('click', modal.onCloseButtonClicked);
	window.addEventListener('keyup', modal.onKeyPressed);
}

export default function Modal(options = {}) {

	if (!options.content) {
		throw new Error('Modal expects a content property.');
		return;
	}

	this.id = uniqueId();
	this.state = 'closed';
	this.content = options.content;
	this.modal = createModalElements(this.content, this.id);
	this.onOverlayClicked = overlayClicked.bind(this);
	this.onCloseButtonClicked = closeButtonClicked.bind(this);
	this.onKeyPressed = keyPressed.bind(this);
}

function dispatchEventHook(event, eventProps = {}) {
	if (eventProps) {
		// Assign any custom props to the event before dispatching
		for (const key in eventProps) {
			if (eventProps.hasOwnProperty(key)) {
				event[key] = eventProps[key];
			}
		}
	}
	document.dispatchEvent(event);
}

Modal.prototype.open = function() {
	if (this.state !== stateString.open) { // Prevent unnecessarily inserting to DOM

		// Transition open
		this.state = stateString.opening;
		document.body.appendChild(this.modal);
		attachEvents(this);
		dispatchEventHook(onOpening, { id: this.id, parent: this.modal });

		setTimeout(() => {
			// Slight delay before adding class so opacity has chance to transition
			this.modal.classList.add(stateString.opening);
		}, 1);

		setTimeout(() => {
			this.state = stateString.open;
			this.modal.classList.remove(stateString.opening);
			this.modal.classList.add(stateString.open);
			dispatchEventHook(onOpen, { id: this.id, parent: this.modal });
		}, 200);
	}
};

Modal.prototype.close = function() {
	if (this.state !== stateString.closed) {
		this.state = stateString.closing;
		dispatchEventHook(onClosing, { id: this.id, parent: this.modal });

		// Transition close and remove from DOM
		this.modal.classList.add(stateString.closing);
		setTimeout(() => {
			this.state = stateString.closed;
			this.modal.classList.remove(stateString.open, stateString.closing);
			this.modal.parentNode.removeChild(this.modal);
			dispatchEventHook(onClosed, { id: this.id, parent: this.modal });
		}, 200);
	}
};
