import samplePerson from './samplePerson.json';

const RANDOM_USER_ENDPOINT = 'https://randomuser.me/api/';

type Person = (typeof samplePerson.results)[number];

export const getRandomName = async (): Promise<{
	first: string;
	last: string;
}> => {
	const result = await fetch(RANDOM_USER_ENDPOINT);
	const { results } = await result.json();
	const person: Person = results[0];
	return { first: person.name.first, last: person.name.last };
};
