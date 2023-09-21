import { NextFunction, Request, Response } from 'express';
import { Movie, MovieResult } from './interfaces';
import { client } from './database';

async function verifyIfIdExists(
	request: Request,
	response: Response,
	next: NextFunction
): Promise<void | Response> {
	const { id } = request.params;
	const queryString: string = `
	SELECT * FROM movies
	WHERE id = $1;
	`;
	const queryResult: MovieResult = await client.query(queryString, [id]);

	const movie: Movie = queryResult.rows[0];

	if (!movie) {
		return response.status(404).json({ error: 'Movie not found!' });
	}

	response.locals = { ...response.locals, movie: movie };

	return next();
}

async function verifyIfMovieExists(
	request: Request,
	response: Response,
	next: NextFunction
): Promise<void | Response> {
	const { name } = request.body;

	if (!name) {
		return next();
	}

	const queryString: string = `
	SELECT * FROM movies
	WHERE name = $1;
	`;
	const queryResult: MovieResult = await client.query(queryString, [name]);
	const movie: Movie = queryResult.rows[0];

	if (movie) {
		return response.status(409).json({ error: 'Movie name already exists!' });
	}

	return next();
}

export default { verifyIfIdExists, verifyIfMovieExists };
