import {
	Alert,
	Button,
	Divider,
	Flex,
	List,
	Skeleton,
	Spin,
	Typography,
	message,
} from 'antd';
import usePlayerSearch from '../../../hooks/usePlayerSearch';
import { useContext } from 'react';

import universalPlayerStyles from '../../../universalStyles/Player.module.css';
import universalLayoutStyles from '../../../universalStyles/Layout.module.css';
import { FavoritesContext } from '../../../context/Favorites';

import universalCommonStyles from '../../../universalStyles/Common.module.css';
import FavoriteStar from '../../Common/FavoriteStar';
import { Players } from '@react-monorepo/types';

const { Text } = Typography;

type SearchResultListProps = ReturnType<typeof usePlayerSearch> & {
	data?: Players['data'];
	searchLoading?: boolean;
};

const SearchResultList = ({
	data,
	searchLoading,
	currentPage,
	isLoading,
	hasNextPage,
	nextPage,
	hasPreviousPage,
	previousPage,
	error,
}: SearchResultListProps) => {
	const { favoritePlayers, addFavorite, removeFavorite } =
		useContext(FavoritesContext);
	const [, notificationContextHolder] = message.useMessage();

	return (
		<section className={universalLayoutStyles['main-column']}>
			{(data?.length ?? 0) === 0 ? (
				isLoading.results || searchLoading ? (
					<Flex justify="center" align="center">
						<Spin size="large" />
					</Flex>
				) : (
					<Text>No players found.</Text>
				)
			) : (
				<>
					{error && <Alert type="error" message="Error" description={error} />}
					{notificationContextHolder}
					<List
						size="small"
						dataSource={data}
						renderItem={(player) => (
							<List.Item key={player.id}>
								<Skeleton title={false} loading={isLoading.results} active>
									<List.Item.Meta
										title={
											<div>
												<span className={universalPlayerStyles['player-name']}>
													{player.first_name} {player.last_name}
												</span>
												<FavoriteStar
													isFavorite={Boolean(favoritePlayers?.[player.id])}
													onFavorite={() => {
														addFavorite(player);
														message.success(
															`${player.first_name} ${player.last_name} added to favorites`
														);
													}}
													onUnfavorite={() => {
														removeFavorite(player.id);
														message.success(
															`${player.first_name} ${player.last_name} removed from favorites`
														);
													}}
												/>
											</div>
										}
										description={player.team.full_name}
									/>
								</Skeleton>
							</List.Item>
						)}
					/>

					<Divider />
					<Flex justify="center">
						<div className={universalCommonStyles['bottom-buttons']}>
							<Button
								loading={isLoading.prev}
								disabled={!hasPreviousPage}
								onClick={previousPage}
							>
								Previous Page
							</Button>
							{currentPage && <Text>Page {currentPage}</Text>}
							<Button
								loading={isLoading.next}
								disabled={!hasNextPage}
								onClick={nextPage}
							>
								Next Page
							</Button>
						</div>
					</Flex>
				</>
			)}
		</section>
	);
};

export default SearchResultList;
