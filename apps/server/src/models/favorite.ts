import { Model, DataTypes } from 'sequelize';

import sequelize from '../db';
import {
	Tables,
	type Conference,
	type Division,
	type FavoritePlayerData,
	type Position,
	BaseSchema,
} from '@react-monorepo/types';

type FavoritePlayerInstance = FavoritePlayerData & BaseSchema;

export class Favorite
	extends Model<FavoritePlayerData, FavoritePlayerInstance>
	implements FavoritePlayerData
{
	// Player attributes
	public id!: number;
	public first_name!: string;
	public height_feet!: number | null;
	public height_inches!: number | null;
	public last_name!: string;
	public position!: Position;
	public weight_pounds!: number | null;

	// Team attributes
	public team_id: number;
	public abbreviation!: string;
	public city!: string;
	public conference!: Conference;
	public division!: Division;
	public team_full_name!: string;
	public team_name: string;

	// Extra frontend data
	public backgroundColor?: string;
	public nickname?: string;

	// Added by sequelized when added to backend database
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Favorite.init(
	{
		// Player attributes
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		first_name: { type: DataTypes.STRING, allowNull: false },
		height_feet: DataTypes.INTEGER,
		height_inches: DataTypes.INTEGER,
		last_name: { type: DataTypes.STRING, allowNull: false },
		position: { type: DataTypes.STRING, allowNull: false },
		weight_pounds: DataTypes.INTEGER,

		// Team attributes
		team_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		abbreviation: DataTypes.STRING,
		city: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		conference: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		division: { type: DataTypes.STRING, allowNull: false },
		team_full_name: { type: DataTypes.STRING, allowNull: false },
		team_name: { type: DataTypes.STRING, allowNull: false },

		// Extra frontend data
		backgroundColor: DataTypes.STRING,
		nickname: DataTypes.STRING,
	},
	{
		sequelize,
		tableName: Tables.FavoritePlayers,
	}
);
