import { ApolloClient, InMemoryCache } from '@apollo/client';
import { BACKEND_URI } from '@react-monorepo/types';

const favoritesClient = new ApolloClient({
	uri: BACKEND_URI,
	cache: new InMemoryCache(),
});

export default favoritesClient;
