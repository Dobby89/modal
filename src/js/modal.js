export default class Modal {
    constructor(options = {}) {

        console.log('modal');

        if (!options.content) {
            throw new Error('Modal expects a content property');
            return;
        }

        this.content = options.content;
    }
}
