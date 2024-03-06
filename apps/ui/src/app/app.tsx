import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PlayerSearch from './components/PlayerSearch';
import TwoColumnLayout from './layout/TwoColumnLayout';
import FavoritePlayers from './components/FavoritePlayers';
import { FavoritesContext } from './context/Favorites';
import db, {
	type Player,
	type FavoritePlayerData,
	type FavoritePlayersById,
	type PartialFavoritePlayerData,
} from './data/db';
import { useEffect, useState } from 'react';
import layoutStyles from './universalStyles/Layout.module.css';
import { merge } from 'ts-deepmerge';

const queryClient = new QueryClient();

const App = () => {
	const [favoritePlayers, setFavoritePlayers] = useState<FavoritePlayersById>(
		[]
	);

	const reloadFavorites = async () => {
		// Since this is indexedDb and not a state variable, we need to update manually
		setFavoritePlayers(await db.getAllFavoritePlayers());
	};

	const addFavorite = async (player: Player) => {
		if (favoritePlayers[player.id]) {
			return;
		}
		const newFave = {
			...player,
			dateLastAdded: new Date(),
		} as FavoritePlayerData;
		await db.addFavoritePlayer(newFave);
		reloadFavorites();
	};

	const updateFavorite = async (player: PartialFavoritePlayerData) => {
		if (!favoritePlayers[player.id]) {
			return;
		}
		const faves = { ...favoritePlayers };
		const newFave = merge(faves[player.id], player) as FavoritePlayerData;
		faves[player.id] = newFave;
		await db.addFavoritePlayer(newFave);
		reloadFavorites();
	};

	const removeFavorite = async (playerId: number) => {
		await db.removeFavoritePlayer(playerId);
		reloadFavorites();
	};

	useEffect(() => {
		const initializeFavorites = async () => {
			setFavoritePlayers(await db.getAllFavoritePlayers());
		};

		void initializeFavorites();
	}, []);

	return (
		<main className={`App ${layoutStyles['main']}`}>
			<FavoritesContext.Provider
				value={{ favoritePlayers, addFavorite, updateFavorite, removeFavorite }}
			>
				<QueryClientProvider client={queryClient}>
					<TwoColumnLayout classNames={layoutStyles['main-row']}>
						<PlayerSearch />
						<FavoritePlayers />
					</TwoColumnLayout>
				</QueryClientProvider>
			</FavoritesContext.Provider>
		</main>
	);
};

export default App;
