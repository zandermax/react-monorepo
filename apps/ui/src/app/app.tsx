import { ApolloProvider } from '@apollo/client';
import favoritesClient from './providers/favorites';
import Main from './layout/Main';

const App = () => {
	return (
		<ApolloProvider client={favoritesClient}>
			<Main />
		</ApolloProvider>
	);
};

export default App;
