import { Singleton } from '@common/decorators';
import { getEnv } from '@common/functions';
import { DISNEY_HOME_API } from '../../constants';
import { HomeDataFetching } from '../../data-fetching';
import type { HomeAPIResponse } from '../../types';

@Singleton()
export class HomeEffects {
    constructor(
        private readonly api: HomeDataFetching = new HomeDataFetching(),
        private readonly homeApiDomain: string = getEnv('DISNEY_HOME_API_DOMAIN'),
    ) {}

    async fetchHomeJSON(): Promise<HomeAPIResponse | null> {
        const endpoint = `${this.homeApiDomain}/${DISNEY_HOME_API}`;
        return this.api.get<HomeAPIResponse>(endpoint);
    }
}
