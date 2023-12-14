import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import roles from "../configs/roles";
import { handleAddGenre, handleDeleteGenre, handleGetAllGenres, handleUpdateGenre } from "../controllers/genre.controller";

const genreRoutes = Router();

// Routes Here

// ADD GENRE ROUTE
genreRoutes.post("/", authMiddleware(roles.ADMIN) as any, handleAddGenre as any) // TODO: rem

// ALL GENRE ROUTE
genreRoutes.get("/", authMiddleware(roles.USER) as any, handleGetAllGenres as any)

// UPDATE GENRE ROUTE
genreRoutes.route("/:id")
    .put(authMiddleware(roles.ADMIN) as any, handleUpdateGenre as any)
    .patch(authMiddleware(roles.ADMIN) as any, handleUpdateGenre as any)

// DELETE GENRE ROUTE
genreRoutes.delete("/:id", authMiddleware(roles.ADMIN) as any, handleDeleteGenre as any)
export default genreRoutes;
