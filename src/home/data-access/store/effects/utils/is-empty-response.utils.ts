export function isEmptyResponse(response: Response): boolean {
    const NOT_FOUND = 404;
    return !response.ok || response.status === NOT_FOUND;
}
