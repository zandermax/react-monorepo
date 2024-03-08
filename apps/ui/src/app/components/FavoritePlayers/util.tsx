import { CollapseProps, Descriptions } from 'antd';
import { DEFAULT_BACKGROUND_COLOR } from '../../data/db';
import fontColorContrast from 'font-color-contrast';
import type { FavoritePlayerData } from '@react-monorepo/types';

export const getFontColorForPlayer = (player: FavoritePlayerData) => {
	return fontColorContrast(player.backgroundColor ?? DEFAULT_BACKGROUND_COLOR);
};

type PlayerDisplayProps = {
	labelTextColor: string;
	player: FavoritePlayerData;
};
export const getPlayerDisplay = ({
	labelTextColor,
	player,
}: PlayerDisplayProps): CollapseProps['items'] => [
	{
		key: player.id,
		label: <span style={{ color: labelTextColor }}>{player.team_name}</span>,
		children: (
			<Descriptions
				items={[
					{
						key: 'position',
						label: 'Player Position',
						children: player.position === '' ? '(Unknown)' : player.position,
					},
					{
						key: 'height',
						label: 'Player Height',
						children:
							!player.height_feet || !player.height_inches
								? '(Unknown)'
								: `${player.height_feet} ft ${player.height_inches} in`,
					},
					{
						key: 'weight',
						label: 'Player Weight',
						children: !player.weight_pounds
							? '(Unknown)'
							: `${player.weight_pounds} lbs`,
					},
					{
						key: 'id',
						label: 'Player ID',
						span: 3,
						children: player.id,
					},
					{
						key: 'team',
						label: 'Team Name',

						children: player.team_name,
					},
					{
						key: 'team_city',
						label: 'Team City',
						children: player.city,
					},
					{
						key: 'team_conference',
						label: 'Team Conference',
						children:
							player.conference.trim().length > 0
								? player.conference.trim()
								: '(N/A)',
					},
					{
						key: 'team_division',
						label: 'Team Division',
						children:
							player.division.trim().length > 0
								? player.division.trim()
								: '(N/A)',
					},
				]}
			/>
		),
	},
];
