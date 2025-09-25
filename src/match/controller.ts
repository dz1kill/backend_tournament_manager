import * as express from "express";
import { FinishMatchDTO } from "./types";
import { updateMatchWinner } from "./service";

export async function finishMatch(
  req: FinishMatchDTO,
  res: express.Response
): Promise<void> {
  try {
    const { winnerUserId, matchId, tournamentId, loserId } = req.body;
    const result = await updateMatchWinner(
      winnerUserId,
      matchId,
      tournamentId,
      loserId
    );
    res.status(result.statusCode || 200).json({ message: result.message });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}
