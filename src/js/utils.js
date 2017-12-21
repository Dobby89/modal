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


// export function htmlToElement(htmlString) {
// 	const hostElement = document.createElement('div');
// 	let element = null;
// 	hostElement.innerHTML = htmlString;
// 	document.body.appendChild(hostElement);
// 	element = hostElement.firstChild; // Grab the markup we've generated
// 	hostElement.parentNode.removeChild(hostElement); // Tidy up after ourselves

// 	return element;
// }
