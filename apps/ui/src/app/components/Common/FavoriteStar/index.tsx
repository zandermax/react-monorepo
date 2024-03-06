import { StarFilled, StarOutlined } from '@ant-design/icons';

type FavoriteStarProps = {
	isFavorite: boolean;
	onFavorite: () => void;
	onUnfavorite: () => void;
};

const FavoriteStar: React.FC<FavoriteStarProps> = ({
	isFavorite,
	onFavorite,
	onUnfavorite,
}) => {
	return isFavorite ? (
		<StarFilled onClick={onUnfavorite} />
	) : (
		<StarOutlined onClick={onFavorite} />
	);
};

export default FavoriteStar;
