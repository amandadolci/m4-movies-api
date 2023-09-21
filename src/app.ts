import express, { Application } from 'express';
import { connectDatabase } from './database';
import logics from './logics';
import middlewares from './middlewares';

const app: Application = express();
app.use(express.json());

app.get('/movies', logics.readMovies);
app.post('/movies', middlewares.verifyIfMovieExists, logics.createMovie);

app.use('/movies/:id', middlewares.verifyIfIdExists);
app.get('/movies/:id', logics.retrieveMovie);
app.patch('/movies/:id', middlewares.verifyIfMovieExists, logics.updateMovie);
app.delete('/movies/:id', logics.destroyMovie);

const port = process.env.PORT;
const runningMsg: string = `Server is running on http://localhost:${port}`;

app.listen(port, async () => {
	await connectDatabase();
	console.log(runningMsg);
});