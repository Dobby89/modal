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
