import { FavoritePlayerData } from '@react-monorepo/types';
import { Favorite } from './models/favorite';

export const resolvers = {
	Query: {
		favorites: () => Favorite.findAll(),
		favorite: async (_, { id }: { id: number }) => {
			const favorite = await Favorite.findByPk(id);
			return favorite;
		},
	},

	Mutation: {
		addFavorite: async (_, { favorite }: { favorite: FavoritePlayerData }) => {
			const newFavorite = await Favorite.create(favorite);
			return newFavorite;
		},
		removeFavorite: async (_, { id }: { id: number }) => {
			const favorite = await Favorite.findByPk(id);
			await Favorite.destroy({ where: { id } });
			return favorite;
		},
		updateFavorite: async (
			_,
			{ favorite }: { favorite: FavoritePlayerData }
		) => {
			const updatedFavorite = await Favorite.findByPk(favorite.id);
			await updatedFavorite.update(favorite);
			return updatedFavorite;
		},
	},
};
