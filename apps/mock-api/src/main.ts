import express, { type Request } from 'express';
import {
	ALL_PLAYERS_ENDPOINT,
	type Endpoint,
	LOCAL_PORT,
	type Params,
	type Players,
	DEFAULT_SEARCH_OPTIONS,
} from '@react-monorepo/types';

import mockedPlayers from './mock/players.json';

const app = express();

const server = app.listen(LOCAL_PORT, () => {
	console.log(`Listening at http://localhost:${LOCAL_PORT}`);
});
server.on('error', console.error);

type PlayerListRequest = Request & {
	query: Params[Endpoint.ALL_PLAYERS];
};

app.get(ALL_PLAYERS_ENDPOINT, async (req: PlayerListRequest, res) => {
	const page = Number.parseInt(`${req.query.page ?? 1}`);
	const per_page = Number.parseInt(
		`${req.query.per_page ?? DEFAULT_SEARCH_OPTIONS.per_page}`
	);

	// Calculate the pagination
	const offset = (page - 1) * per_page;
	const endPlayer = offset + per_page;
	let players = mockedPlayers as Players['data'];
	// Search
	if (req.query.search) {
		// Case-insensitive search
		const searchText = req.query.search.toLowerCase();
		players = players.filter(
			(player) =>
				player.first_name.toLowerCase().match(searchText) ||
				player.last_name.toLowerCase().match(searchText)
		);
	}
	const paginatedPlayers = players.slice(offset, endPlayer);

	const result: Players = {
		data: paginatedPlayers,
		meta: {
			current_page: page,
			next_page: endPlayer < mockedPlayers.length ? page + 1 : null,
			per_page,
		},
	};

	// Return the paginated data
	res.send(result);
});
