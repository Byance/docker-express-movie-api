import database from "./mysql.config.js";
export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();
      const [genres] = await database.query(
        "select id, name from genre where lower(name) = ?;",
        [lowerCaseGenre]
      );
      if (genres.length === 0) return [];
      const [{ id }] = genres;
      return [];
    }
    const movies = await database.query(
      "select BIN_TO_UUID(id) id, title, year, director, duration, poster, rate from movie;"
    );
    return movies;
  }
  static async getById({ id }) {
    const [movies] = await database.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id 
        FROM movie WHERE id = UUID_TO_BIN(?);"`,
      [id]
    );
    if (movies.length === 0) return null;
    return movies[0];
  }
  static async create({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster,
    } = input;

    const genres = genreInput.map((g) => g.toLowerCase());
    const [dbGenres] = await database.query(
      "select id, name from genre where lower(name) in (?)",
      [genres]
    );
    const dbGenreIds = dbGenres.map(({ id }) => id);
    const notFoundGenre = genres.find((g) => !dbGenreIds.includes(g));
    if (notFoundGenre) {
      throw new Error(`Genre "${notFoundGenre}" not found`);
    }

    const [[uuidResult]] = await database.query("SELECT UUID() AS uuid");
    const [{ uuid }] = uuidResult;

    try {
      await database.query(
        `INSERT INTO movie(id, title, year, director, duration, poster, rate)
          VALUES(UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [
          input.title,
          input.year,
          input.director,
          input.duration,
          input.poster,
          input.rate,
        ]
      );
    } catch (error) {
      throw new Error("Error while creating movie");
    }
    return { id: insertId };
  }
  static async delete({ id }) {
    const result = await database.query(
      "DELETE FROM movie WHERE id = UUID_TO_BIN(?)",
      [id]
    );
    return result.affectedRows > 0;
  }
  static async update({ id, input }) {
    const {
      genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster,
    } = input;

    const genres = genreInput.map((g) => g.toLowerCase());
    const [dbGenres] = await database.query(
      "select id, name from genre where lower(name) in (?)",
      [genres] // ["action", "drama"]
    );
    const dbGenreIds = dbGenres.map(({ id }) => id);
    const notFoundGenre = genres.find((g) => !dbGenreIds.includes(g));
    if (notFoundGenre) {
      throw new Error(`Genre "${notFoundGenre}" not found`);
    }

    const result = await database.query(
      `UPDATE movie SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ? WHERE id = UUID_TO_BIN(?)`,
      [title, year, director, duration, poster, rate, id]
    );
    return result.affectedRows > 0;
  }
}
