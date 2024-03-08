import { DeleteFilled, DeleteOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import styles from './styles/FavoritePlayers.module.css';
import type { FavoritePlayerData } from '@react-monorepo/types';

type RemoveFavoriteIconProps = {
	handleRemoveFavorite: (player: FavoritePlayerData) => void;
	isHoveringOnPlayer: number | null;
	setIsHoveringOnPlayer: (id: number | null) => void;
	player: FavoritePlayerData;
};

const RemoveFavoriteIcon: React.FC<RemoveFavoriteIconProps> = ({
	handleRemoveFavorite,
	player,
	isHoveringOnPlayer,
	setIsHoveringOnPlayer,
}) => (
	<Tooltip
		placement="right"
		title={`Remove ${
			player.nickname ?? player.first_name + ' ' + player.last_name
		} from favorites`}
		onOpenChange={(open) =>
			open ? setIsHoveringOnPlayer(player.id) : setIsHoveringOnPlayer(null)
		}
	>
		<span
			className={styles['remove-favorite-icon']}
			onClick={() => {
				handleRemoveFavorite(player);
			}}
		>
			{isHoveringOnPlayer === player.id ? <DeleteFilled /> : <DeleteOutlined />}
		</span>
	</Tooltip>
);

export default RemoveFavoriteIcon;
