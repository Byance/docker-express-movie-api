import express from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import { createMovieRouter } from "./routes/movies.js";
import { MovieModel } from "./models/mysql/movie.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json());

app.use(corsMiddleware());

app.use("/movies", createMovieRouter({ movieModel: MovieModel }));

app.use((req, res) => {
  res.status(404).send("<h1>404</h1>");
});
app.listen(process.env.PORT || 3000, () =>
  console.log("Server is up and running")
);
