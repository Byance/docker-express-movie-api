import cors from "cors";
const ACCEPTED_ORIGINS = ["http://localhost:8080"];
export const corsMiddleware = (
  req,
  res,
  { acceptedOrigins = ACCEPTED_ORIGINS }
) => {
  const origin = req.header("origin");
  if (acceptedOrigins.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
  }
};

moviesRouter.options("/:id ", (req, res) => {
  corsMiddleware(req, res);
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
});
