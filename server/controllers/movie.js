import { MovieModel } from "../models/movie.js";
export class MovieController {
  static async getAll(req, res) {
    const { genre } = req.query;
    const movies = await MovieModel.getAll({ genre });
    res.json(movies);
  }
  static async getById(req, res) {
    const { id } = req.params;
    const movie = await MovieModel.getById({ id: id });
    if (movie) return res.json(movie);
    res.status(404).json({ message: "Movie not found" });
  }
  static async create(req, res) {
    const result = validateMovie(req.body);
    res.send("Post movies API");
    if (result.error) {
      return res.status(400).json({ error: result.error.message });
    }
    /* const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    } */
    const newMovie = await MovieModel.create({ input: result.data });
    res.status(201).json(newMovie);
  }
  static async delete(req, res) {
    const { id } = req.params;
    //const movieIndex = movies.findindex(movie => movie.id === id)
    /*  if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' })
    } */
    const result = await MovieModel.delete({ id: id });
    if (result === false) {
      return res.status(404).json({ message: "Movie not Found" });
    }
    return res.json({ message: "Movie deleted" });
  }
  static async update(req, res) {
    res.send("Patch movies API");
    const result = validatePartialMovie(req.body);
    if (result.error) {
      return res.status(400).json({ error: result.error.message });
    }
    const { id } = req.params;
    /* const updateMovie = {
    ...result.data,
  }; */
    const updatedMovie = await MovieModel.update({
      id: id,
      input: result.data,
    });
    return res.json(updatedMovie);
  }
}
