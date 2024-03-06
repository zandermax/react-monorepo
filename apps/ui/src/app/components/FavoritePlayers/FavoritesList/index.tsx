import { RightOutlined } from '@ant-design/icons';
import { List, Typography, Collapse, message } from 'antd';
import {
	DEFAULT_BACKGROUND_COLOR,
	FavoritePlayerData,
	PartialFavoritePlayerData,
	PlayerId,
} from '../../../data/db';
import PlayerColorPicker from '../../Common/PlayerColorPicker';
import RemoveFavoriteIcon from '../RemoveFavoriteIcon';
import styles from '../styles/FavoritePlayers.module.css';
import { getFontColorForPlayer, getPlayerDisplay } from '../util';
import { useContext, useEffect, useState } from 'react';
import { FavoritesContext } from '../../../context/Favorites';
import universalPlayerStyles from '../../../universalStyles/Player.module.css';

const DEFAULT_FAVORITES_PER_PAGE = 5;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

const FavoritesList = () => {
	const { favoritePlayers, removeFavorite, updateFavorite } =
		useContext(FavoritesContext);
	const [currentPage, setCurrentPage] = useState(1);
	const [favoritesPerPage, setFavoritesPerPage] = useState(
		DEFAULT_FAVORITES_PER_PAGE
	);
	const [isHoveringOnPlayer, setIsHoveringOnPlayer] = useState<PlayerId | null>(
		null
	);

	const [messageApi, contextHolder] = message.useMessage();

	const handleRemoveFavorite = (player: FavoritePlayerData) => {
		setIsHoveringOnPlayer(null);
		removeFavorite(player.id);
		messageApi.success(
			`${player.first_name} ${player.last_name} removed from favorites`
		);
	};

	const handleUpdateFavorite = (player: PartialFavoritePlayerData) => {
		updateFavorite(player);
		const displayName =
			player.nickname ?? `${player.first_name} ${player.last_name}`;
		messageApi.success(`${displayName} updated`);
	};

	const [filteredPlayers, setFilteredPlayers] = useState<FavoritePlayerData[]>(
		Object.values(favoritePlayers)
	);

	useEffect(() => {
		setFilteredPlayers(Object.values(favoritePlayers));
	}, [favoritePlayers]);

	return (
		<>
			{contextHolder}
			{filteredPlayers.length > 0 ? (
				<List
					dataSource={filteredPlayers}
					renderItem={(player) => (
						<List.Item key={player.id}>
							<List.Item.Meta
								title={
									<div className={styles['player-name-container']}>
										<RemoveFavoriteIcon
											isHoveringOnPlayer={isHoveringOnPlayer}
											setIsHoveringOnPlayer={setIsHoveringOnPlayer}
											player={player}
											handleRemoveFavorite={handleRemoveFavorite}
										/>
										<span>
											<Typography.Text
												className={universalPlayerStyles['player-name']}
												editable={{
													onChange: (nickname) =>
														handleUpdateFavorite({
															nickname,
															id: player.id,
														}),
												}}
											>
												{player.nickname ??
													`${player.first_name} ${player.last_name}`}
											</Typography.Text>
											{player.nickname &&
												player.nickname !==
													`${player.first_name} ${player.last_name}` && (
													<Typography.Text>
														({player.first_name} {player.last_name})
													</Typography.Text>
												)}
										</span>
										<span className={styles['player-color-picker']}>
											<PlayerColorPicker
												currentColor={
													player.backgroundColor ?? DEFAULT_BACKGROUND_COLOR
												}
												onColorSelected={(color) => {
													handleUpdateFavorite({
														backgroundColor: color.toHexString(),
														id: player.id,
														nickname: player.nickname,
														first_name: player.first_name,
														last_name: player.last_name,
													});
												}}
											/>
										</span>
									</div>
								}
								description={
									<Collapse
										size="small"
										expandIcon={
											!player.backgroundColor
												? undefined
												: ({ isActive }) => (
														<RightOutlined
															rotate={isActive ? 90 : 0}
															style={{
																color: getFontColorForPlayer(player),
															}}
														/>
												  )
										}
										style={{
											background: player.backgroundColor,
										}}
										items={getPlayerDisplay({
											labelTextColor: getFontColorForPlayer(player),
											player,
										})}
									/>
								}
							/>
						</List.Item>
					)}
					pagination={{
						align: 'center',
						onChange: (page) => setCurrentPage(page),
						current: currentPage,
						showSizeChanger: true,
						defaultPageSize: DEFAULT_FAVORITES_PER_PAGE,
						pageSize: favoritesPerPage,
						pageSizeOptions: PAGE_SIZE_OPTIONS,
						onShowSizeChange: (_lastIndex, index) =>
							setFavoritesPerPage(PAGE_SIZE_OPTIONS[index]),
					}}
				/>
			) : (
				<div className={styles['no-players-container']}>
					<Typography.Title level={2}>No favorites found 😢</Typography.Title>
				</div>
			)}
		</>
	);
};

export default FavoritesList;
