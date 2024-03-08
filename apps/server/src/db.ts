import { DB_NAME } from '@react-monorepo/types';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: `${DB_NAME}.sqlite`,
});

export default sequelize;
