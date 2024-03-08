// To avoid a more complex schema for a simple project,
// Teams' properties are stored directly with Players.
// Luckily, the fields are named uniquely so only a few need renamed here.

import { Players, Team } from './players';

export type Player = Players['data'][number];

export type TeamData = {
	team_id: Team['id'];
	team_name: Team['name'];
	team_full_name: Team['full_name'];
};

export type ConsolidatedPlayer = Omit<Player, 'team'> &
	Omit<Team, 'id' | 'full_name' | 'name'> &
	TeamData;
