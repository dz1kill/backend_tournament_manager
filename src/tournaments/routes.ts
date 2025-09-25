import * as express from "express";
import {
  createTournament,
  finishTournament,
  findTournaments,
  startTournament,
  registerTournament,
  findLeaderboard,
} from "./controller";

export const tournaments: express.IRouter = express.Router();
tournaments.post("/new", createTournament);
tournaments.patch("/:tournamentId/start", startTournament);
tournaments.patch("/:tournamentId/finish", finishTournament);
tournaments.get("/find", findTournaments);
tournaments.post("/register", registerTournament);
tournaments.get("/find_leaderboard/:id", findLeaderboard);
