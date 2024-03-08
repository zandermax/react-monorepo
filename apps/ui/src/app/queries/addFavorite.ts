import { gql } from '@apollo/client';

export const ADD_FAVORITE = gql`
	mutation AddFavorite($favorite: FavoriteInput!) {
		addFavorite(favorite: $favorite) {
			# Player attributes
			id
			first_name
			height_feet
			height_inches
			last_name
			position
			weight_pounds

			# Team attributes
			team_id
			abbreviation
			city
			conference
			division
			team_full_name
			team_name

			# Added when placed in database
			createdAt
			updatedAt
		}
	}
`;
