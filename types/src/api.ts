export const MOCK_API_PORT = 3331;
export const ALL_PLAYERS_ENDPOINT = '/api/v1/players';
export enum Endpoint {
	// Note: this API is no longer available for free, so we're using a local server instead.
	// ALL_PLAYERS = 'https://www.balldontlie.io/api/v1/players',

	ALL_PLAYERS = `http://localhost:${MOCK_API_PORT}${ALL_PLAYERS_ENDPOINT}`,
}

export type Params = {
	[Endpoint.ALL_PLAYERS]: {
		page?: number;
		per_page?: number;
		search?: string;
	};
};

export const DEFAULT_SEARCH_OPTIONS: Params[Endpoint.ALL_PLAYERS] = {
	per_page: 10,
};
