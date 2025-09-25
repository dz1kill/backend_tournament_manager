import {
  addUserToTournament,
  closeTournament,
  findTournamentsByStatus,
  getLeaderboard,
  newTournament,
  runTournament,
} from "./service";
import {
  CreateTournamentDTO,
  FindLeaderboardData,
  getTournamentDTO,
  registerTournamentDTO,
  startTournamentDTO,
  SuccessResponseFindLeaderboard,
  TournamentCreateResult,
  TournamentFinishResult,
  TournamentRunResult,
} from "./types";
import * as express from "express";

export async function createTournament(
  req: CreateTournamentDTO,
  res: express.Response
): Promise<void> {
  try {
    const { name } = req.body;
    const result: TournamentCreateResult = await newTournament(name);
    res.status(result.statusCode || 200).json({ message: result.message });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}

export async function startTournament(
  req: startTournamentDTO,
  res: express.Response
): Promise<void> {
  try {
    const { tournamentId } = req.params;
    const result: TournamentRunResult = await runTournament(tournamentId);
    res.status(result.statusCode || 200).json({ message: result.message });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}

export async function finishTournament(
  req: startTournamentDTO,
  res: express.Response
): Promise<void> {
  try {
    const { tournamentId } = req.params;
    const result: TournamentFinishResult = await closeTournament(tournamentId);
    res.status(result.statusCode || 200).json({ message: result.message });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}

export async function findTournaments(
  req: getTournamentDTO,
  res: express.Response
): Promise<void> {
  try {
    const { data } = req.query;
    const result = await findTournamentsByStatus(data);
    res.status(result.statusCode || 200).json({ data: result.data });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
}

export async function registerTournament(
  req: registerTournamentDTO,
  res: express.Response
): Promise<void> {
  try {
    const { userId, tournamentId } = req.body;
    const result = await addUserToTournament(userId, tournamentId);
    res.status(result.statusCode || 200).json({ message: result.message });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
}

export async function findLeaderboard(
  req: FindLeaderboardData,
  res: express.Response
): Promise<void> {
  try {
    const { id } = req.params;
    const tournamentId = Number(id);
    const result: SuccessResponseFindLeaderboard = await getLeaderboard(
      tournamentId
    );
    res.status(result.statusCode || 200).json({ data: result.data });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  }
}
