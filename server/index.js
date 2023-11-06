import express from "express";
import { moviesRouter } from "./routes/movies.js";
import { corsMiddleware } from "./middlewares/cors.js";
const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ Title: "Hola este es mi servidor hecho en express" });
});
app.use(corsMiddleware());
app.use("/movies", moviesRouter);

app.use((req, res) => {
  res.status(404).send("<h1>404</h1>");
});
app.listen(process.env.PORT || 3000, () =>
  console.log("Server is up and running and the reload work")
);
