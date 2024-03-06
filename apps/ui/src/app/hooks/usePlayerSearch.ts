import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { merge } from 'ts-deepmerge';

import localStorage, { EndpointData } from '../data/localStorage';
import {
	Convert,
	DEFAULT_SEARCH_OPTIONS,
	Endpoint,
	Params,
	Players,
} from '@react-monorepo/types';

const DEBOUNCE_MS = 500;

export type SearchResult = Awaited<ReturnType<typeof requestSearch>>;

type SearchOperation = 'Next Page' | 'Prev Page' | 'Search text';

/**
 * Gets player data from the API and converts it to be strongly typed
 * @returns Player data, typed
 */
const requestSearch = async (params?: Params[Endpoint.ALL_PLAYERS]) => {
	const fullParams = params
		? merge(DEFAULT_SEARCH_OPTIONS, params)
		: DEFAULT_SEARCH_OPTIONS;

	const url = new URL(Endpoint.ALL_PLAYERS);
	if (fullParams) {
		for (const [key, value] of Object.entries(fullParams)) {
			if (value !== undefined && value !== null) {
				url.searchParams.append(key, `${value}`);
			}
		}
	}

	// TODO respond from local server
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}`);
	}

	const json = await response.json();
	const typedPlayers = Convert.toPlayers(JSON.stringify(json));
	return typedPlayers;
};

/**
 * Custom hook to get player data from the API
 */
export const usePlayerSearch = () => {
	// Used to determine when to debounce API calls
	const [isRequestPending, setIsRequestPending] = useState(false);

	const [lastRequestedOp, setLastRequestedOp] = useState<SearchOperation>();
	const [params, setParams] = useState<Params[Endpoint.ALL_PLAYERS]>(
		localStorage.getEndpointData(Endpoint.ALL_PLAYERS) ?? {}
	);

	// Using this feature of React query avoids flashing updates between keystrokes
	const [placeholderData, setPlaceholderData] = useState<Players>();

	const queryKey = [Endpoint.ALL_PLAYERS, params];
	const result = useQuery({
		queryKey,
		queryFn: () => requestSearch(params),
		placeholderData,
	});

	// Using a state variable to enable users to throw errors manually
	// So users can see how neat errors look 😁
	const [error, setError] = useState(result.error?.message);
	useEffect(() => {
		setError(result.error?.message);
	}, [result.error]);

	useEffect(() => {
		if (result.data) {
			setPlaceholderData(result.data);
		}
	}, [result.data]);

	useEffect(() => {
		localStorage.setEndpointData({
			endpoint: Endpoint.ALL_PLAYERS,
			data: params,
		});
	}, [params]);

	const handleParamsUpdate = (newParams: Params[Endpoint.ALL_PLAYERS]) => {
		// Limit rate of API calls
		if (isRequestPending) {
			setTimeout(() => {
				setParams(newParams);
				setIsRequestPending(false);
			}, DEBOUNCE_MS);
		} else {
			setIsRequestPending(true);
			setParams(newParams);
		}
	};

	const search = (searchParams: Params[Endpoint.ALL_PLAYERS]) => {
		setLastRequestedOp('Search text');
		handleParamsUpdate(searchParams);
	};

	const nextPage = () => {
		const currentPage = result?.data?.meta.current_page ?? 1;
		if (result?.data?.meta.next_page) {
			setLastRequestedOp('Next Page');
			handleParamsUpdate(
				merge<EndpointData[Endpoint.ALL_PLAYERS][]>(params, {
					page: currentPage + 1,
				})
			);
		}
	};

	const previousPage = () => {
		const currentPage = result?.data?.meta.current_page ?? 1;
		if (currentPage > 1) {
			setLastRequestedOp('Prev Page');
			handleParamsUpdate(
				merge<EndpointData[Endpoint.ALL_PLAYERS][]>(params, {
					page: currentPage - 1,
				})
			);
		}
	};

	return {
		currentPage: result?.data?.meta.current_page,
		// Separate loading types to make UI loading indicators specific
		// (i.e. not everything should show spinners at the same time)
		isLoading: {
			next: result.isLoading && lastRequestedOp === 'Next Page',
			prev: result.isLoading && lastRequestedOp === 'Prev Page',
			results: result.isLoading,
			search: result.isLoading && lastRequestedOp === 'Search text',
		},
		error,
		setError,
		hasNextPage: Boolean(result.data?.meta.next_page),
		nextPage,
		hasPreviousPage: (result.data?.meta.current_page ?? 1) > 1,
		previousPage,
		search,
		result: result.data,
	};
};

export default usePlayerSearch;
