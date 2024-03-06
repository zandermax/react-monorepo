import { Players } from '@react-monorepo/types';
import { openDB, DBSchema } from 'idb';

const DB_VERSION = 1;
const DB_NAME = 'app-db';

enum Tables {
	FavoritePlayers = 'favorite-players',
}

export type Player = Players['data'][number];
export type PlayerId = Player['id'];

export const DEFAULT_BACKGROUND_COLOR = '#FAFAFA';
export type FavoritePlayerData = Player & {
	backgroundColor?: string;
	dateLastAdded: Date;
	nickname?: string;
};

export type PartialFavoritePlayerData = Partial<FavoritePlayerData> &
	Pick<FavoritePlayerData, 'id'>;

export type FavoritePlayersById = {
	[id: PlayerId]: FavoritePlayerData;
};

interface IAppDB extends DBSchema {
	[Tables.FavoritePlayers]: {
		key: number;
		value: FavoritePlayerData;
		indexes: { 'by-date': Date };
	};
}

const getDbInstance = async () => {
	const indexedDB = await openDB<IAppDB>(DB_NAME, DB_VERSION, {
		upgrade(db) {
			const store = db.createObjectStore(Tables.FavoritePlayers, {
				// 'id' from Player type
				keyPath: 'id',
			});
			store.createIndex('by-date', 'dateLastAdded');
		},
	});

	return indexedDB;
};

export type DbOperations = {
	getAllFavoritePlayers: () => Promise<FavoritePlayersById>;
	addFavoritePlayer: (player: FavoritePlayerData) => Promise<void>;
	removeFavoritePlayer: (playerId: PlayerId) => Promise<void>;
};
/**
 * Interact with indexedDb
 * @returns stateless methods that allow interacting with this app's data in the browser's indexedDb
 */
const db: DbOperations = {
	// Gets all favorites, indexed by date last added
	getAllFavoritePlayers: async () => {
		const dbInstance = await getDbInstance();
		const result = await dbInstance.getAllFromIndex(
			Tables.FavoritePlayers,
			'by-date'
		);
		dbInstance.close();
		const players: FavoritePlayersById = {};
		for (const player of result) {
			players[player.id] = player;
		}
		return players;
	},

	addFavoritePlayer: async (player: FavoritePlayerData) => {
		const dbInstance = await getDbInstance();
		await dbInstance.put(Tables.FavoritePlayers, player);
		dbInstance.close();
	},

	removeFavoritePlayer: async (playerId: PlayerId) => {
		const dbInstance = await getDbInstance();
		await dbInstance.delete(Tables.FavoritePlayers, playerId);
		dbInstance.close();
	},
};

export default db;
