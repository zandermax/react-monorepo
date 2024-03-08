/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';
import type {
	FavoritePlayersById,
	PartialFavoritePlayerData,
} from '../data/db';
import { Player } from 'types/src/consolidated';
import { FavoritePlayerData } from '@react-monorepo/types';

type Favorites = {
	favoritePlayers: FavoritePlayersById;
	favoritesLoading: boolean;
	addFavorite: (player: Player) => Promise<FavoritePlayerData | null>;
	updateFavorite: (
		player: PartialFavoritePlayerData
	) => Promise<FavoritePlayerData | null>;
	removeFavorite: (id: number) => Promise<void>;
};

export const FavoritesContext = createContext<Favorites>({
	favoritePlayers: [],
	favoritesLoading: false,
	addFavorite: () => Promise.resolve(null),
	updateFavorite: () => Promise.resolve(null),
	removeFavorite: () => Promise.resolve(),
});
