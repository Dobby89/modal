import { createElement } from './utils';

function createModalElements(content) {
    const wrapper = createElement('div', { class: 'modal-container' });
    wrapper.appendChild(content);

    content.removeAttribute('style');

    return wrapper;
}

function insertModal(modal) {
    document.body.appendChild(modal);
}

export default function Modal(options = {}) {

    if (!options.content) {
        throw new Error('Modal expects a content property.');
        return;
    }

    this.content = options.content;
    this.modal = createModalElements(this.content);
    insertModal(this.modal);
}
