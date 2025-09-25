import sequelize from "../models";
import {
  addScoreToUser,
  addScoreUserToTournament,
  matchFinish,
} from "./helper";
import { FinishMatchResult } from "./types";

export async function updateMatchWinner(
  winnerUserId: number,
  matchId: number,
  tournamentId: number
): Promise<FinishMatchResult> {
  const pointsToAdd = 10;

  await sequelize.transaction(async (transaction) => {
    await matchFinish(winnerUserId, matchId, transaction);
    await addScoreUserToTournament(
      tournamentId,
      winnerUserId,
      transaction,
      pointsToAdd
    );
    await addScoreToUser(winnerUserId, pointsToAdd, transaction);
  });
  return {
    message: `Match Finished!`,
    statusCode: 201,
  };
}
