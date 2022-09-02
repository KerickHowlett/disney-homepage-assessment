import type { Callback } from '@disney/shared/types';
import { isEmpty, isUndefined } from '@disney/shared/utils';

export type HTMLProperties = Record<string, string>;

const addHTMLProperties =
    <T extends HTMLElement>(callback: Callback) =>
    (element: T, properties?: HTMLProperties): void => {
        if (isUndefined(properties) || isEmpty(Object.keys(properties))) return;
        for (const [propertyName, propertyValue] of Object.entries(properties)) {
            callback(element, propertyName, propertyValue);
        }
    };

const _addStyles = <T extends HTMLElement>(element: T, property: string, value: string): void => {
    element.style.setProperty(property, value);
};
const _addAttributes = <T extends HTMLElement>(element: T, property: string, value: string): void => {
    element.setAttribute(property, value);
};

export const addAttributes = addHTMLProperties(_addAttributes);
export const addStyles = addHTMLProperties(_addStyles);
