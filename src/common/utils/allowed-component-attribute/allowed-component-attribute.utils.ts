type ObservedAttributes = { observedAttributes: string[] };

export function allowedComponentAttribute<TComponent extends ObservedAttributes>(
    attributeName: string,
    { observedAttributes }: TComponent,
): boolean {
    return observedAttributes.includes(attributeName);
}
