import { createElement } from './utils';

function createModalElements(content) {
    const wrapper = createElement('div', { class: 'modal-container' });
    wrapper.appendChild(content);

    content.removeAttribute('style');

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
