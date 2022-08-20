import type { HTMLProperty } from './utils';
import { addAttributes, addClasses, addStyles, setID, setInnerText } from './utils';

export interface ElementFactoryInit {
    readonly attributes?: HTMLProperty[];
    readonly classes?: string[];
    readonly id?: string;
    readonly innerHTML?: string;
    readonly selector?: string;
    readonly styles?: HTMLProperty[];
    readonly innerText?: string;
}

export function elementFactory<T extends HTMLElement = HTMLDivElement>(options: Readonly<ElementFactoryInit> = {}): T {
    const element: T = document.createElement(options.selector || 'div') as T;

    setID<T>(element, options.id);
    addClasses(element, options.classes);
    addStyles(element, options.styles);
    addAttributes(element, options.attributes);
    setInnerText(element, options.innerHTML);

    return element;
}
