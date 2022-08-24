import { isHTMLChildren, isString, isUndefined } from '@common/utils';
import { addAttributes, addClasses, addStyles, appendChildren, HTMLProperty, setID, setTextContent } from './utils';

export interface ElementFactoryInit {
    readonly attributes?: HTMLProperty[];
    readonly classes?: string[];
    readonly id?: string;
    readonly body?: HTMLTemplateElement | Array<HTMLElement | Node> | string;
    readonly styles?: HTMLProperty[];
    readonly tagName?: string;
}

export function elementFactory<T extends HTMLElement = HTMLDivElement>(options: Readonly<ElementFactoryInit> = {}): T {
    const element: T = document.createElement(options.tagName || 'div') as T;

    setID<T>(element, options.id);
    addClasses(element, options.classes);
    addStyles(element, options.styles);
    addAttributes(element, options.attributes);

    if (isUndefined(options.body)) {
        return element;
    }
    if (isString(options.body)) {
        setTextContent(element, options.body);
    }
    if (isHTMLChildren(options.body)) {
        appendChildren(element, ...options.body);
    }

    return element;
}
