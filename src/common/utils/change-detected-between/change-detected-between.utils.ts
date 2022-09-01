export function changeDetectedBetween(newTemplate: string | number, currentTemplate: string | number): boolean {
    return currentTemplate !== newTemplate;
}
