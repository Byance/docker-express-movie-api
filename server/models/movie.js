import { randomUUID } from "node:crypto";
export class MovieModel {
  #movies;
  constructor(movies) {
    this.movies = movies || {};
  }
  static async getAll({ genre }) {
    if (genre) {
      return this.movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }
  }
  static async getById({ id }) {
    const movie = this.movies.find((movie) => movie.id === id);
    return movie;
  }
  static async create({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input,
    };
    this.movies.push(newMovie);
    return newMovie;
  }
  static async delete({ id }) {
    const movieIndex = this.movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;
    this.movies.splice(movieIndex, 1);
    return true;
  }
  static async update({ id, input }) {
    const movieIndex = this.movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;
    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input,
    };
    return movies[movieIndex];
  }
}
