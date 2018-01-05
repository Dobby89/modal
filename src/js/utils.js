export function createElement(name, attributes, content) {
	const el = document.createElement(name);

	Object.keys(attributes).forEach(attr => {
		el.setAttribute(attr, attributes[attr]);
	});

	if (content) {
		el.innerHTML = content;
	}

	return el;
}

/**
 * Create a DOM element from a string without
 * having to append to a containing <div>
 *
 * @param {String} e.g. `<div><span>Hello World</span></div> Foo bar`
 * @return {Element}
 */
export function htmlToFragment(htmlString) {
	const fragment = document.createDocumentFragment();
	const wrapper = document.createElement('div');
	wrapper.innerHTML = htmlString;

	Array.from(wrapper.childNodes).forEach(child => fragment.appendChild(child));

	return fragment;
}

/**
 * Generate an incremental unique ID
 * Dirty but worky
 */
let uid = 0;
export function uniqueId() {
	uid = uid + 1;
	return uid;
}

/**
 * Create a custom event
 *
 * @param {String} eventString
 */
export function createEvent(eventString) {
	if (document.createEvent) {
		// Fallback for browsers which don't have Event constructor
		const event = document.createEvent('CustomEvent');
		event.initEvent(eventString, true, true);
		return event;
	}
	return new Event(eventString);
}
