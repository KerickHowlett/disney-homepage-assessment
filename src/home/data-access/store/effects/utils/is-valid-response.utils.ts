import { isUndefined } from '@disney/shared';
import { isEmptyResponse } from './is-empty-response.utils';

export function isValidResponse(response?: Response): response is Response {
    return !isUndefined(response) && !isEmptyResponse(response);
}
