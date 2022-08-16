import { Component } from '@common/decorators';

@Component({
    selector: 'disney-image',
})
export class ImageComponent extends HTMLImageElement {
    constructor() {
        super();
    }
}
