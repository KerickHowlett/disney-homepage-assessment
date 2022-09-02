export function isNode(item: unknown): item is Node {
    return item instanceof Node;
}
