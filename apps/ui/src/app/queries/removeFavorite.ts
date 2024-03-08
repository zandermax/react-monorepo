import { gql } from '@apollo/client';

export const REMOVE_FAVORITE = gql`
	mutation RemoveFavorite($id: Int!) {
		removeFavorite(id: $id) {
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

			# Extra frontend data
			backgroundColor
			nickname

			# Added when placed in database
			createdAt
			updatedAt
		}
	}
`;
