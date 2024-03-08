import { NetworkStatus, useMutation, useQuery } from '@apollo/client';
import {
	type BaseSchema,
	DB_NAME,
	type FavoritePlayerData,
	Tables,
} from '@react-monorepo/types';
import { openDB, DBSchema } from 'idb';
import type { ConsolidatedPlayer } from 'types/src/consolidated';
import { UPDATE_FAVORITE } from '../queries/updateFavorite';
import { REMOVE_FAVORITE } from '../queries/removeFavorite';
import { ADD_FAVORITE } from '../queries/addFavorite';
import { merge } from 'ts-deepmerge';
import { useEffect, useState } from 'react';
import { GET_FAVORITES } from '../queries/getFavorites';

const INDEXEDDB_VERSION = 1;

export type PlayerId = FavoritePlayerData['id'];

export const DEFAULT_BACKGROUND_COLOR = '#FAFAFA';

export type PartialFavoritePlayerData = Partial<FavoritePlayerData> &
	Pick<FavoritePlayerData, 'id'>;

export type FavoritePlayersById = {
	[id: PlayerId]: FavoritePlayerData;
};

type FavoritesServerData = { favorites: FavoritePlayerData[] };

// Defines the type of data in indexedDb so the data types are typed by Typescript
interface IAppDB extends DBSchema {
	[Tables.FavoritePlayers]: {
		key: number;
		value: FavoritePlayerData;
	};
}

const removeBackendData = <T extends BaseSchema>(data: T) => {
	// Remove backend-generated fields
	const {
		__typename,
		createdAt: _createdAt,
		updatedAt: _updatedAt,
		...convertedData
	} = data;
	return convertedData;
};

// Defined type signature to allow one overloaded function
type AddOrRemoveFavorite = {
	(
		player: PartialFavoritePlayerData,
		isUpdate: true
	): Promise<FavoritePlayerData | null>;
	(player: FavoritePlayerData): Promise<FavoritePlayerData | null>;
};

/**
 * Interact with indexedDb and backend data.
 * For this project, data is only loaded from the backend when there is nothing in indexedDb yet.
 * All other operations (create, update, delete) will send updates to the backend accordingly.
 * @returns hook with statuses and methods that allow interacting with persistent storage
 */
const useDb = () => {
	const {
		error: reloadRemoteError,
		data,
		loading: remoteLoading,
		networkStatus,
		refetch,
	} = useQuery<FavoritesServerData>(GET_FAVORITES, {
		notifyOnNetworkStatusChange: true,
	});
	const [addFavoriteRemote, { error: addRemoteError }] =
		useMutation(ADD_FAVORITE);
	const [removeFavoriteRemote, { error: removeRemoteError }] =
		useMutation(REMOVE_FAVORITE);
	const [updateFavoriteRemote, { error: updateRemoteError }] =
		useMutation(UPDATE_FAVORITE);

	const [favoritePlayers, setFavoritePlayers] = useState<FavoritePlayersById>(
		[]
	);
	const [indexedDbLoading, setIndexedDbLoading] = useState(false);
	const [favoritesLoading, setFavoritesLoading] = useState(false);
	const [indexedDbError, setIndexedDbError] = useState<string | undefined>();
	const [error, setError] = useState<string | undefined>();

	const _getDbInstance = async () => {
		const keyPath: keyof ConsolidatedPlayer = 'id';
		const indexedDB = await openDB<IAppDB>(DB_NAME, INDEXEDDB_VERSION, {
			async upgrade(db) {
				db.createObjectStore(Tables.FavoritePlayers, {
					keyPath,
				});
				// Since this operation is called when there is no database, load favorites from backend
				const favorites = data?.favorites;
				if (favorites) {
					favorites.forEach((favorite) => {
						db.put(Tables.FavoritePlayers, favorite);
					});
				}
			},
		});

		return indexedDB;
	};

	const _addOrUpdateFavoritePlayer: AddOrRemoveFavorite = async (
		playerData,
		isUpdate = false
	) => {
		setError(undefined);
		let fullPlayerData: FavoritePlayerData;
		if (isUpdate) {
			if (!favoritePlayers[playerData.id]) {
				return null;
			}
			fullPlayerData = merge(
				favoritePlayers[playerData.id],
				playerData
			) as FavoritePlayerData;
		} else {
			fullPlayerData = playerData as FavoritePlayerData;
		}

		const player = removeBackendData(fullPlayerData);
		// Add favorite to remote
		const operation = isUpdate ? updateFavoriteRemote : addFavoriteRemote;
		try {
			await operation({ variables: { favorite: player } });
			await refetch();
		} catch (e) {
			// If there was an error (e.g. user is offline),
			// update state manually to attempt to keep indexedDb in sync
			setError((e as Error).message);
			const createdPlayer = player;
			const updatedFavorites = { ...favoritePlayers };
			updatedFavorites[createdPlayer.id] = createdPlayer;
			setFavoritePlayers(updatedFavorites);
		}

		return fullPlayerData;
	};

	const addFavoritePlayer = async (newPlayer: FavoritePlayerData) => {
		return await _addOrUpdateFavoritePlayer(newPlayer);
	};

	const _putFavoritePlayerInIndexedDb = async (player: FavoritePlayerData) => {
		try {
			setIndexedDbLoading(true);
			setIndexedDbError(undefined);
			const dbInstance = await _getDbInstance();
			await dbInstance.put(Tables.FavoritePlayers, player);
			dbInstance.close();
		} catch (e) {
			setIndexedDbError((e as Error).message);
		} finally {
			setIndexedDbLoading(false);
		}
	};

	const _removeFavoritePlayerFromIndexedDb = async (id: PlayerId) => {
		try {
			setIndexedDbLoading(true);
			setIndexedDbError(undefined);
			const dbInstance = await _getDbInstance();
			await dbInstance.delete(Tables.FavoritePlayers, id);
			dbInstance.close();
		} catch (e) {
			setIndexedDbError((e as Error).message);
		} finally {
			setIndexedDbLoading(false);
		}
	};

	const updateFavoritePlayer = async (player: PartialFavoritePlayerData) => {
		if (!favoritePlayers[player.id]) {
			return null;
		}
		return await _addOrUpdateFavoritePlayer(player, true);
	};

	const removeFavoritePlayer = async (id: PlayerId) => {
		setError(undefined);
		await removeFavoriteRemote({ variables: { id } });
		await refetch();
	};

	useEffect(() => {
		setFavoritesLoading(
			remoteLoading ||
				indexedDbLoading ||
				// Apollo GraphQL considers refetching as a separate status than loading
				networkStatus === NetworkStatus.refetch
		);
	}, [indexedDbLoading, networkStatus, remoteLoading]);

	// Whenever backend data is updated, set state (which will then update indexedDb)
	useEffect(() => {
		if (data) {
			const newFavoritePlayers: FavoritePlayersById = {};
			for (const favorite of data.favorites) {
				newFavoritePlayers[favorite.id] = favorite;
			}
			setFavoritePlayers(newFavoritePlayers);
		}
	}, [data]);

	// Whenever the state variable is updated, sync it with indexedDb
	useEffect(() => {
		const updateIndexedDb = async () => {
			let dbInstance: Awaited<ReturnType<typeof _getDbInstance>>;
			try {
				dbInstance = await _getDbInstance();
				const favoritePlayersInIndexedDb = await dbInstance.getAll(
					Tables.FavoritePlayers
				);
				Object.values(favoritePlayersInIndexedDb).forEach(async (player) => {
					// If there are entries in indexedDb that are not in state, remove them from indexedDb
					if (!(player.id in favoritePlayers)) {
						await _removeFavoritePlayerFromIndexedDb(player.id);
					}
				});
				// Add all players in state that are not in indexedDb
				Object.values(favoritePlayers).forEach(_putFavoritePlayerInIndexedDb);
			} catch (e) {
				setIndexedDbError((e as Error).message);
			}
		};
		void updateIndexedDb();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [favoritePlayers]);

	// Handle any errors from remote or local db
	useEffect(() => {
		setError(
			[
				addRemoteError?.message &&
					`Error adding favorite: '${addRemoteError.message}'`,
				removeRemoteError?.message &&
					`Error removing favorite: '${removeRemoteError.message}'`,
				updateRemoteError?.message &&
					`Error updating favorite: '${updateRemoteError.message}'`,
				indexedDbError &&
					`Error saving to browser storage: '${indexedDbError}'`,
			]
				.filter((err) => Boolean(err))
				.join('; ')
		);
	}, [
		addRemoteError,
		reloadRemoteError,
		removeRemoteError,
		updateRemoteError,
		indexedDbError,
	]);

	return {
		favoritePlayers,
		favoritesLoading,
		error,
		addFavoritePlayer,
		updateFavoritePlayer,
		removeFavoritePlayer,
	};
};

export default useDb;
