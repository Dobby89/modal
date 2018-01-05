import { createElement, createEvent, htmlToFragment, uniqueId } from './utils';

const stateString = {
	open: 'open',
	opening: 'opening',
	closed: 'closed',
	closing: 'closing'
};
const onOpening = createEvent('modal-opening');
const onOpen = createEvent('modal-open');
const onClosing = createEvent('modal-closing');
const onClosed = createEvent('modal-closed');

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
	const modalClose = modal._modal.querySelector('.modal-close');
	const modalOverlay = modal._modal.querySelector('.modal-overlay');

	modalOverlay.addEventListener('click', modal._onOverlayClicked);
	modalClose.addEventListener('click', modal._onCloseButtonClicked);
	window.addEventListener('keyup', modal._onKeyPressed);
}

export default function Modal(options = {}) {

	if (!options.content) {
		throw new Error('Modal expects a content property.');
		return;
	}

	this._id = uniqueId();
	this._state = stateString.closed;
	this._content = options.content;
	this._modal = createModalElements(this._content, this._id);
	this._onOverlayClicked = overlayClicked.bind(this);
	this._onCloseButtonClicked = closeButtonClicked.bind(this);
	this._onKeyPressed = keyPressed.bind(this);
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
	// Prevent unnecessarily inserting to DOM
	if (this._state !== stateString.open) {

		// Transition open
		this._state = stateString.opening;
		document.body.appendChild(this._modal);
		attachEvents(this);
		dispatchEventHook(onOpening, { id: this._id, parent: this._modal });

		setTimeout(() => {
			// Slight delay before adding class so opacity has chance to transition
			this._modal.classList.add(stateString.opening);
		}, 1);

		setTimeout(() => {
			this._state = stateString.open;
			this._modal.classList.remove(stateString.opening);
			this._modal.classList.add(stateString.open);
			dispatchEventHook(onOpen, { id: this._id, parent: this._modal });
		}, 200);
	}
};

Modal.prototype.close = function() {
	// Only attempt to close if not closed
	if (this._state !== stateString.closed) {
		this._state = stateString.closing;
		dispatchEventHook(onClosing, { id: this._id, parent: this._modal });

		// Transition close and remove from DOM
		this._modal.classList.add(stateString.closing);
		setTimeout(() => {
			this._state = stateString.closed;
			this._modal.classList.remove(stateString.open, stateString.closing);
			this._modal.parentNode.removeChild(this._modal);
			dispatchEventHook(onClosed, { id: this._id, parent: this._modal });
		}, 200);
	}
};
