import { ConsolidatedPlayer } from './consolidated';

// Name of the Sqlite file and IndexedDb database
export const DB_NAME = 'app-db';

// Values added when placing data in the backend database
export type BaseSchema = {
	// Typename is not used on the front end, but it's added by Apollo client for caching,
	// so it needs to be removed before sending the data to the backend
	__typename?: 'Favorite';
	createdAt?: Date;
	updatedAt?: Date;
};

export type FavoritePlayerData = ConsolidatedPlayer &
	BaseSchema & {
		backgroundColor?: string;
		nickname?: string;
	};

// Table names are the same in each database
export enum Tables {
	FavoritePlayers = 'favorite_players',
}
