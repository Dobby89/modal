import { createElement, createEvent, htmlToElement, uniqueId } from './utils';

const defaults = {
	closeButton:
		'<button class="modal-close" aria-label="Close modal">Close</button>'
};
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

function createModalElements(instance) {
	let { id, content, options } = instance;

	if (typeof content === 'string') {
		content = htmlToElement(content);
	}

	const wrapper = createElement('div', {
		class: 'modal-container',
		'data-modal-id': id
	});
	const overlay = createElement('div', { class: 'modal-overlay' });
	const modalContent = createElement('div', { class: 'modal-content' });
	instance.closeButton = htmlToElement(options.closeButton);
	// const modalClose = createElement('button', { class: 'modal-close' }, 'Close');

	if (content.removeAttribute) {
		content.removeAttribute('style');
	}

	modalContent.appendChild(content);
	wrapper.appendChild(overlay);
	wrapper.appendChild(instance.closeButton);
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
	if (
		typeof evt.keyCode !== 'undefined' &&
		evt.keyCode &&
		evt.keyCode !== 27
	) {
		return;
	}
	this.close();
}

function attachEvents(instance) {
	let {
		modal,
		closeButton,
		onOverlayClicked,
		onCloseButtonClicked,
		onKeyPressed
	} = instance;

	// const modalClose = modal.querySelector('.modal-close');
	const modalOverlay = modal.querySelector('.modal-overlay');

	modalOverlay.addEventListener('click', onOverlayClicked);
	closeButton.addEventListener('click', onCloseButtonClicked);
	window.addEventListener('keyup', onKeyPressed);
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

export default function Modal(options = {}) {
	if (!options.content) {
		throw new Error('Modal expects a content property.');
		return;
	}

	this.options = Object.assign({}, defaults, options);

	this.id = uniqueId();
	this.state = stateString.closed;
	this.content = options.content;
	this.modal = createModalElements(this);
	this.onOverlayClicked = overlayClicked.bind(this);
	this.onCloseButtonClicked = closeButtonClicked.bind(this);
	this.onKeyPressed = keyPressed.bind(this);
}

Modal.prototype.open = function() {
	// Prevent unnecessarily inserting to DOM
	if (this.state !== stateString.open) {
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
	// Only attempt to close if not closed
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
