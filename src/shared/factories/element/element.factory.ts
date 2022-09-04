import { isHTMLChildren, isString, isUndefined } from '@disney/shared';
import {
    addAttributes,
    addClasses,
    addEventHandlers,
    addStyles,
    appendChildren,
    HTMLProperties,
    setID,
    setTextContent,
} from './utils';

export interface ElementFactoryInit {
    readonly attributes?: HTMLProperties;
    readonly classes?: string[];
    readonly eventHandlers?: Partial<GlobalEventHandlers>;
    readonly id?: string;
    readonly body?: HTMLTemplateElement | Array<HTMLElement | Node> | string;
    readonly styles?: HTMLProperties;
    readonly tagName?: string;
}

export function elementFactory<T extends HTMLElement = HTMLDivElement>(options: Readonly<ElementFactoryInit> = {}): T {
    const element: T = document.createElement(options.tagName || 'div') as T;

    setID<T>(element, options.id);
    addClasses(element, options.classes);
    addStyles(element, options.styles);
    addAttributes(element, options.attributes);
    addEventHandlers(element, options.eventHandlers);

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
