import { createElement, createEvent, htmlToElement, uniqueId } from './utils';

const defaults = {
	classes: {
		container: 'modal-container',
		overlay: 'modal-overlay',
		content: 'modal-content'
	},
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

function createElements(instance) {
	let { id, content, options } = instance;
	let { classes } = options;

	if (typeof content === 'string') {
		content = htmlToElement(content);
	}

	const containerEl = createElement('div', {
		class: classes.container,
		'data-modal-id': id
	});
	const overlayEl = createElement('div', { class: classes.overlay });
	const contentEl = createElement('div', { class: classes.content });
	const closeButtonEl = htmlToElement(options.closeButton);

	if (content.removeAttribute) {
		content.removeAttribute('style');
	}

	contentEl.appendChild(content);
	containerEl.appendChild(overlayEl);
	containerEl.appendChild(closeButtonEl);
	containerEl.appendChild(contentEl);

	return {
		container: containerEl,
		overlay: overlayEl,
		content: contentEl,
		closeButton: closeButtonEl
	};
}

function overlayClicked(evt) {
	evt.preventDefault();
	this.close();
}

function closeButtonClicked(evt) {
	evt.preventDefault();
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
		overlay,
		closeButton,
		onOverlayClicked,
		onCloseButtonClicked,
		onKeyPressed
	} = instance;

	overlay.addEventListener('click', onOverlayClicked);
	closeButton.addEventListener('click', onCloseButtonClicked);
	window.addEventListener('keyup', onKeyPressed);
}

function dispatchLifecycleHook(event, eventProps = {}) {
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
	this.onOverlayClicked = overlayClicked.bind(this);
	this.onCloseButtonClicked = closeButtonClicked.bind(this);
	this.onKeyPressed = keyPressed.bind(this);

	const modalElements = createElements(this);
	this.container = modalElements.container;
	this.overlay = modalElements.overlay;
	this.closeButton = modalElements.closeButton;
}

Modal.prototype.open = function() {
	// Prevent unnecessarily inserting to DOM
	if (this.state !== stateString.open) {
		// Transition open
		this.state = stateString.opening;
		document.body.appendChild(this.container);
		attachEvents(this);
		dispatchLifecycleHook(onOpening, { id: this.id, parent: this.container });

		setTimeout(() => {
			// Slight delay before adding class so opacity has chance to transition
			this.container.classList.add(stateString.opening);
		}, 1);

		setTimeout(() => {
			this.state = stateString.open;
			this.container.classList.remove(stateString.opening);
			this.container.classList.add(stateString.open);
			dispatchLifecycleHook(onOpen, { id: this.id, parent: this.container });
		}, 200);
	}
};

Modal.prototype.close = function() {
	// Only attempt to close if not closed
	if (this.state !== stateString.closed) {
		this.state = stateString.closing;
		dispatchLifecycleHook(onClosing, { id: this.id, parent: this.container });

		// Transition close and remove from DOM
		this.container.classList.add(stateString.closing);
		setTimeout(() => {
			this.state = stateString.closed;
			this.container.classList.remove(stateString.open, stateString.closing);
			this.container.parentNode.removeChild(this.container);
			dispatchLifecycleHook(onClosed, { id: this.id, parent: this.container });
		}, 200);
	}
};
