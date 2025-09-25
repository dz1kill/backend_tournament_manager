import * as express from "express";
import { findLeaderboard, registration } from "./controller";

export const users: express.IRouter = express.Router();
users.post("/sing-up", registration);
users.get("/find_leaderboard", findLeaderboard);
