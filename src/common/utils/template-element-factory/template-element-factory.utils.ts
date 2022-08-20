import { isUndefined } from '../is-undefined';

export interface TemplateElementFactoryInit {
    readonly innerHTML?: string;
    readonly styles?: ReadonlyArray<TemplateStyleProperty>;
}
export type TemplateStyleProperty = `${string}: ${string};` | `${string}:${string}`;

const trimPropertyAndValue = (string: string): string => string.trim();

export function templateElementFactory({ innerHTML, styles }: TemplateElementFactoryInit = {}): HTMLTemplateElement {
    const template: HTMLTemplateElement = document.createElement('template');
    template.innerHTML = innerHTML || '';

    if (isUndefined(styles)) return template;

    for (const style of styles) {
        const [property, value] = style.split(':').map(trimPropertyAndValue);
        template.style.setProperty(property, value);
    }

    return template;
}
