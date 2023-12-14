import { Response } from 'express';
import { Request } from 'express';
import express from 'express';
// import { createServer } from "node:http"
import dotenv from "dotenv"
import "express-async-errors"

dotenv.config()

import preMiddleware from './middlewares/pre.middleware';
import errorMiddleware from './middlewares/error.middleware';

import swaggerui from './configs/swaggerui';
import database from './configs/database';  

import allRoutes from "./routes"


const app = express();
// const server = createServer(app);
const PORT = process.env.PORT || 5100
const ORIGIN = process.env.ORIGIN || `http://localhost:${PORT}`

// Pre middlewares
preMiddleware(app);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello From API " + process.env.APP_NAME  })
})

app.get("/ping", (req: Request, res: Response) => {
  res.json({ message: "Hello From API " + process.env.APP_NAME })
})

// Main Routes
// version 1
app.use("/api/v1", allRoutes)

// Swagger UI
swaggerui(app)

// Error middlewares
errorMiddleware(app);

app.listen(PORT, async () => {
  await database();
  console.log(`server running at ${ORIGIN}`)
});
