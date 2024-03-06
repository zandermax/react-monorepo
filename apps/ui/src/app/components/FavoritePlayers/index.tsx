import { Divider, Space, Typography } from 'antd';
import universalLayoutStyles from '../../universalStyles/Layout.module.css';
import FavoritesList from './FavoritesList';

const FavoritePlayers = () => {
	return (
		<section className={universalLayoutStyles['main-column']}>
			<Divider orientation="center">
				<Typography.Title>Favorites</Typography.Title>
			</Divider>
			<Space direction="vertical">
				<FavoritesList />
			</Space>
		</section>
	);
};

export default FavoritePlayers;
