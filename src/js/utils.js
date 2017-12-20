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
 * @param {String} HTML representing a single element e.g. `<div><span>Hello World</span></div>`
 * @return {Element}
 */
export function htmlToElement(htmlString) {
    const wrapper = createElement('div', {}, htmlString);
    document.body.appendChild(wrapper);
    const el = wrapper.firstChild;
    const elClone = el.cloneNode(true);
    el.parentNode.removeChild(el);

    return elClone;
};
