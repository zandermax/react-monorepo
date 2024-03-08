import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { BACKEND_PORT } from '@react-monorepo/types';
import sequelize from './db';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

sequelize.sync();

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

const { url } = await startStandaloneServer(server, {
	listen: { port: BACKEND_PORT },
});

console.log(`🚀  Server ready at: ${url}`);
