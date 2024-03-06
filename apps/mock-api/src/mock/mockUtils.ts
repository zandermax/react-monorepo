// Animals imported from https://freetestapi.com/apis/animals
import {
	Conference,
	Division,
	Players,
	Position,
	Team,
} from '@react-monorepo/types';
import animals from './animals.json';
// Countries imported from https://freetestapi.com/apis/countries
import countries from './countries.json';
import { getRandomName } from './external';

export const getRandomNumber = (min: number, max: number) => {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
};

const getRandomEnum = <T>(anEnum: T): T[keyof T] => {
	const keys = Object.keys(anEnum);
	const randomKey = keys[Math.floor(Math.random() * keys.length)] as keyof T;
	return anEnum[randomKey];
};

export const getRandomConference = () => getRandomEnum(Conference);
export const getRandomDivision = () => getRandomEnum(Division);
export const getRandomPosition = () => getRandomEnum(Position);

type Entity = {
	id: number;
	name: string;
};

const getRandomEntity = (data: Entity[]) => {
	const id = Math.floor(Math.random() * animals.length) + 1;
	const entity = data.find((a) => a.id === id);
	return entity;
};

const getRandomAnimal = () =>
	getRandomEntity(animals)?.name ?? 'Spaghetti Monster';
const getRandomCountry = () => getRandomEntity(countries)?.name ?? 'Utopia';

export const getRandomTeam = (id: number): Team => {
	const location = getRandomCountry();
	let teamMascot = getRandomAnimal();
	teamMascot = `${teamMascot}${
		teamMascot.charAt(teamMascot.length - 1) === 's' ? 'es' : 's'
	}`;
	return {
		id,
		city: location,
		name: teamMascot,
		full_name: `${location} ${teamMascot}`,
		abbreviation: `${location.substring(0, 2)}${teamMascot.substring(
			0,
			1
		)}`.toUpperCase(),
		conference: getRandomConference(),
		division: getRandomDivision(),
	};
};

type GetMockedResponseParams = {
	numPlayers: number;
	current_page?: number;
	next_page?: number;
	per_page?: number;
};
// Used to get mocked data initially
// Because the players are favorited, the list needs to be the same every time,
//   meaning this will only be used to create the players once and not in the app during runtime.
export const getMockedResponse = async ({
	numPlayers,
	current_page = 1,
	next_page = 2,
	per_page = numPlayers,
}: GetMockedResponseParams): Promise<Players> => {
	const players = new Array<Players['data'][number]>(numPlayers);
	for (let i = 0; i < numPlayers; i++) {
		const { first, last } = await getRandomName();
		players[i] = {
			id: i,
			first_name: first,
			last_name: last,
			height_feet: getRandomNumber(5, 8),
			height_inches: getRandomNumber(0, 12),
			position: getRandomPosition(),
			team: getRandomTeam(i),
			weight_pounds: getRandomNumber(150, 250),
		};
	}
	const response: Players = {
		data: players,
		meta: {
			current_page,
			next_page,
			per_page,
		},
	};
	return response;
};
