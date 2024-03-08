export const typeDefs = `#graphql
	type Favorite {
		# Player attributes
		id: Int!
		first_name: String!
		height_feet: Int
		height_inches: Int
		last_name: String!
		position: String!
		weight_pounds: Int
		backgroundColor: String
		nickname: String

		# Team attributes
		team_id: Int!
		abbreviation: String!
		city: String!
		conference: String!
		division: String!
		team_full_name: String!
		team_name: String!

		# Sequelize timestamps
    createdAt: String
    updatedAt: String
	}

	input FavoriteInput {
		# Player attributes
		id: Int!
		first_name: String!
		height_feet: Int
		height_inches: Int
		last_name: String!
		position: String!
		weight_pounds: Int
		backgroundColor: String
		nickname: String

		# Team attributes
		team_id: Int!
		abbreviation: String!
		city: String!
		conference: String!
		division: String!
		team_full_name: String!
		team_name: String!
	}

	type Query {
		favorites: [Favorite]
		favorite(id: Int!): Favorite
	}

	type Mutation {
		addFavorite(favorite: FavoriteInput!): Favorite
		removeFavorite(id: Int!): Favorite
		updateFavorite(favorite: FavoriteInput!): Favorite
	}
`;
