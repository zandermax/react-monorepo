import { Divider, Input, Space, Typography } from 'antd';
import usePlayerSearch from '../../hooks/usePlayerSearch';

import SearchResultList from './SearchResultList';
import { useContext, useEffect, useState } from 'react';
import localStorage from '../../data/localStorage';
import { CloseCircleFilled } from '@ant-design/icons';
import EnhancedFeatures from '../EnhancedFeatures';

import styles from './styles/PlayerSearch.module.css';
import { FavoritesContext } from '../../context/Favorites';
import { Endpoint } from '@react-monorepo/types';

const { Search } = Input;

const PlayerSearch = () => {
	const playerSearch = usePlayerSearch();

	const [searchText, setSearchText] = useState(
		localStorage.getEndpointData(Endpoint.ALL_PLAYERS)?.search
	);

	const { addFavorite, removeFavorite } = useContext(FavoritesContext);

	useEffect(() => {
		playerSearch.search({ search: searchText });
	}, [searchText]);

	return (
		<section>
			<Space direction="vertical" className={styles['player-search']}>
				<Divider orientation="center">
					<Typography.Title>Search for players</Typography.Title>
				</Divider>
				<Search
					loading={playerSearch.isLoading.search}
					placeholder="Search for players by name"
					allowClear={{
						clearIcon: <CloseCircleFilled onClick={() => setSearchText('')} />,
					}}
					onInput={(event) => {
						setSearchText(event.currentTarget.value);
					}}
					value={searchText}
				/>
				<EnhancedFeatures
					setError={playerSearch.setError}
					onAddAllToFavorites={() => {
						for (const player of playerSearch.result?.data ?? []) {
							addFavorite(player);
						}
					}}
					onRemoveAllFromFavorites={() => {
						for (const player of playerSearch.result?.data ?? []) {
							removeFavorite(player.id);
						}
					}}
				/>
				<SearchResultList
					data={playerSearch.result?.data}
					searchLoading={playerSearch.isLoading.search}
					{...playerSearch}
				/>
			</Space>
		</section>
	);
};

export default PlayerSearch;
