import { isUndefined } from '../is-undefined';

export function isValidResponse(response: Response | undefined): response is Response {
    return !isUndefined(response) && response.ok && response.status !== 404;
}
