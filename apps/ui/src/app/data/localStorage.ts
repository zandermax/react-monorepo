import type { Endpoint, Params } from '@react-monorepo/types';

// Each endpoint is associated with its most recently used params
export type EndpointData = {
	[e in Endpoint]: Params[e];
};

type LocalStorage = {
	endpointData: EndpointData;
};

type LocalStorageKey<K extends keyof LocalStorage> = keyof LocalStorage[K];

type SetEndpointDataParams<T extends Endpoint> = {
	endpoint: T;
	data: EndpointData[T];
};

const getItem = <T extends keyof LocalStorage, K extends LocalStorageKey<T>>(
	key: K
) => {
	const result = window.localStorage.getItem(key as string);
	if (!result) return null;
	return JSON.parse(result) as LocalStorage[T][K];
};

const setItem = <T extends keyof LocalStorage, K extends LocalStorageKey<T>>(
	key: K,
	value: LocalStorage[T][K]
) => {
	window.localStorage.setItem(key as string, JSON.stringify(value));
};

// Local storage, used to store small key, value pairs
const localStorage = {
	getEndpointData(endpoint: Endpoint) {
		const result = getItem<'endpointData', typeof endpoint>(endpoint);
		return result;
	},

	setEndpointData<T extends Endpoint>({
		data,
		endpoint,
	}: SetEndpointDataParams<T>) {
		setItem(endpoint, data);
	},
};

export default localStorage;
