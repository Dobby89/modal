import { createElement, htmlToElement } from './utils';

function createModalElements(content) {
    let contentClone = null;

    if (content instanceof Node) {
        // Clone original modal markup
        contentClone = content.cloneNode(true);
    } else {
        contentClone = htmlToElement(content);
    }
    contentClone.removeAttribute('style');

    const wrapper = createElement('div', { class: 'modal-container' });
    const overlay = createElement('div', { class: 'modal-overlay' });
    const modalContent = createElement('div', { class: 'modal-content' });

    modalContent.appendChild(contentClone);
    wrapper.appendChild(overlay);
    wrapper.appendChild(modalContent);

    return wrapper;
}

function insertModal(modal) {
    modal.classList.add('open');
    document.body.appendChild(modal);
}

export default function Modal(options = {}) {

    if (!options.content) {
        throw new Error('Modal expects a content property.');
        return;
    }

    this.state = 'closed';
    this.content = options.content;
    this.modal = createModalElements(this.content);
}

Modal.prototype.open = function() {
    if (this.state !== 'open') { // Prevent unnecessarily inserting to DOM
        this.state = 'open';
        insertModal(this.modal);
    }
}

Modal.prototype.close = function() {
    this.state = 'closed';
    this.modal.classList.remove('open');
}
