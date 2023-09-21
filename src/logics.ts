import { Request, Response } from 'express';
import { MovieCreate, MovieUpdate, MovieResult } from './interfaces';
import format from 'pg-format';
import { client } from './database';

async function readMovies(request: Request, response: Response): Promise<Response> {
	const { category } = request.query;
	const queryString: string = 'SELECT * FROM movies';

	const queryResultAll: MovieResult = await client.query(`${queryString};`);

	if (category) {
		const queryResultCategory: MovieResult = await client.query(
			`${queryString} WHERE category = $1;`,
			[category]
		);
		if (queryResultCategory.rows.length !== 0) {
			return response.status(200).json(queryResultCategory.rows);
		} else {
			return response.status(200).json(queryResultAll.rows);
		}
	}
	return response.status(200).json(queryResultAll.rows);
}

async function createMovie(request: Request, response: Response): Promise<Response> {
	const payload: MovieCreate = request.body;

	const queryFormat: string = format(
		`INSERT INTO movies (%I)
    VALUES (%L)
    RETURNING *;`,
		Object.keys(payload),
		Object.values(payload)
	);

	const queryResult: MovieResult = await client.query(queryFormat);
	return response.status(201).json(queryResult.rows[0]);
}

async function retrieveMovie(request: Request, response: Response): Promise<Response> {
	const { movie } = response.locals;
	return response.status(200).json(movie);
}

async function updateMovie(request: Request, response: Response): Promise<Response> {
	const payload: MovieUpdate = request.body;

	const queryFormat: string = format(
		`UPDATE movies
    SET (%I) = ROW (%L)
    WHERE id = $1
    RETURNING *;`,
		Object.keys(payload),
		Object.values(payload)
	);

	const queryResult: MovieResult = await client.query(queryFormat, [request.params.id]);

	return response.status(200).json(queryResult.rows[0]);
}

async function destroyMovie(request: Request, response: Response): Promise<Response> {
	const queryString: string = `
    DELETE FROM movies
    WHERE id = $1;
  `;
	await client.query(queryString, [request.params.id]);

	return response.status(204).json();
}

export default { readMovies, createMovie, retrieveMovie, updateMovie, destroyMovie };
