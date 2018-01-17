import { createElement, createEvent, htmlToElement, uniqueId } from './utils';

const defaults = {
	classes: {
		container: 'modal-container',
		overlay: 'modal-overlay',
		content: 'modal-content'
	},
	closeButton: '<button class="modal-close" aria-label="Close modal">Close</button>',
	transitionIn: 200,
	transitionOut: 200
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
	if (!(this instanceof Modal)) {
		return new Modal(options);
	}

	if (!options.content) {
		throw new Error('Modal expects a content property.');
		return false;
	}

	this.options = Object.assign({}, defaults, options);

	this.id = uniqueId();
	this.state = stateString.closed;
	this.content = options.content;

	const modalElements = createElements(this);
	this.container = modalElements.container;
	this.overlay = modalElements.overlay;
	this.closeButton = modalElements.closeButton;
}

Modal.prototype.open = function() {
	// Prevent unnecessarily inserting to DOM
	if (this.state !== stateString.open) {
		this.state = stateString.opening;
		document.body.appendChild(this.container);

		// Add event listeners
		this.overlay.addEventListener('click', overlayClicked.bind(this));
		this.closeButton.addEventListener('click', closeButtonClicked.bind(this));
		window.addEventListener('keyup', keyPressed.bind(this));

		dispatchLifecycleHook(onOpening, { id: this.id, parent: this.container });

		setTimeout(() => {
			// Slight delay before adding class so opacity has chance to transition
			this.container.classList.add(stateString.opening);
		}, 1);

		setTimeout(() => {
			// Transition open
			this.state = stateString.open;
			this.container.classList.remove(stateString.opening);
			this.container.classList.add(stateString.open);
			dispatchLifecycleHook(onOpen, { id: this.id, parent: this.container });
		}, this.options.transitionIn);
	}
};

Modal.prototype.close = function() {
	// Only attempt to close if not closed
	if (this.state !== stateString.closed) {
		this.state = stateString.closing;

		// Transition close and remove from DOM
		this.container.classList.add(stateString.closing);
		dispatchLifecycleHook(onClosing, { id: this.id, parent: this.container });

		setTimeout(() => {
			this.state = stateString.closed;
			this.container.classList.remove(stateString.open, stateString.closing);
			this.container.parentNode.removeChild(this.container);
			dispatchLifecycleHook(onClosed, { id: this.id, parent: this.container });
		}, this.options.transitionOut);
	}
};
