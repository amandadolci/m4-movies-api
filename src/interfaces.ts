import { QueryResult } from 'pg';

interface Movie {
	id: number;
	name: string;
	category: string;
	duration: number;
	price: number;
}

type MovieCreate = Omit<Movie, 'id'>;
type MovieUpdate = Partial<MovieCreate>;
type MovieResult = QueryResult<Movie>;

export { Movie, MovieCreate, MovieResult, MovieUpdate };
