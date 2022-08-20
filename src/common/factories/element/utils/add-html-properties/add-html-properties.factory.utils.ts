import type { Callback } from '@common/types';
import { isEmpty, isUndefined } from '@common/utils';

export type HTMLProperty = `${string}: ${string};` | `${string}:${string}`;

const addHTMLProperties = <T extends HTMLElement>(callback: Callback) => {
    const trimPropertyAndValue = (string: string): string => string.trim();

    return (element: T, properties?: HTMLProperty[]): void => {
        if (isUndefined(properties) || isEmpty(properties)) return;
        for (const property of properties) {
            const [propertyName, propertyValue] = property.split(':').map(trimPropertyAndValue);
            callback(element, propertyName, propertyValue);
        }
    };
};

const _addStyles = <T extends HTMLElement>(element: T, property: string, value: string): void => {
    element.style.setProperty(property, value);
};
const _addAttributes = <T extends HTMLElement>(element: T, property: string, value: string): void => {
    element.setAttribute(property, value);
};

export const addAttributes = addHTMLProperties(_addAttributes);
export const addStyles = addHTMLProperties(_addStyles);
