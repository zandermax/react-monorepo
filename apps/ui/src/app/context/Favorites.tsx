/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';
import {
	type FavoritePlayersById,
	Player,
	PartialFavoritePlayerData,
} from '../data/db';

type Favorites = {
	favoritePlayers: FavoritePlayersById;
	addFavorite: (player: Player) => void;
	updateFavorite: (player: PartialFavoritePlayerData) => void;
	removeFavorite: (playerId: number) => void;
};

export const FavoritesContext = createContext<Favorites>({
	favoritePlayers: [],
	addFavorite: () => {},
	updateFavorite: () => {},
	removeFavorite: () => {},
});
