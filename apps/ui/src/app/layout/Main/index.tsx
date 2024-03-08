import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import layoutStyles from '../../universalStyles/Layout.module.css';

import type { FavoritePlayerData } from '@react-monorepo/types';

import useDb from '../../data/db';
import FavoritePlayers from '../../components/FavoritePlayers';
import PlayerSearch from '../../components/PlayerSearch';
import { FavoritesContext } from '../../context/Favorites';

import TwoColumnLayout from '../TwoColumnLayout';
import { Player, TeamData } from 'types/src/consolidated';
import { Alert } from 'antd';

const queryClient = new QueryClient();

const Main = () => {
	const {
		addFavoritePlayer,
		updateFavoritePlayer,
		removeFavoritePlayer,
		favoritePlayers,
		error,
		favoritesLoading,
	} = useDb();

	const addFavorite = async (player: Player) => {
		if (favoritePlayers[player.id]) {
			return null;
		}

		// Combine player and team attributes
		const { team, ...playerData } = player;
		const { id, name, full_name, ...teamData } = team;
		const consolidatedTeamData: TeamData = {
			team_id: id,
			team_name: name,
			team_full_name: full_name,
		};

		const newFave: FavoritePlayerData = {
			...playerData,
			...consolidatedTeamData,
			...teamData,
		};

		return await addFavoritePlayer(newFave);
	};

	return (
		<main className={`App ${layoutStyles['main']}`}>
			<FavoritesContext.Provider
				value={{
					favoritePlayers,
					favoritesLoading,
					addFavorite,
					updateFavorite: updateFavoritePlayer,
					removeFavorite: removeFavoritePlayer,
				}}
			>
				<QueryClientProvider client={queryClient}>
					{error && (
						<Alert
							type="error"
							message="Error updating favorites"
							description={error}
							closable
						/>
					)}
					<TwoColumnLayout classNames={layoutStyles['main-row']}>
						<PlayerSearch />
						<FavoritePlayers />
					</TwoColumnLayout>
				</QueryClientProvider>
			</FavoritesContext.Provider>
		</main>
	);
};

export default Main;
