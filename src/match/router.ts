import * as express from "express";
import { finishMatch } from "./controller";

export const matches: express.IRouter = express.Router();
matches.patch("/finish", finishMatch);
