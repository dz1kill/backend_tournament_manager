import sequelize from "../models";
import {
  addDataLoser,
  addScoreToUser,
  addScoreUserToTournament,
  matchFinish,
} from "./helper";
import { FinishMatchResult } from "./types";

export async function updateMatchWinner(
  winnerUserId: number,
  matchId: number,
  tournamentId: number,
  loserId: number
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
    await addDataLoser(loserId, tournamentId, transaction);
    await addScoreToUser(winnerUserId, pointsToAdd, transaction);
  });
  return {
    message: `Match Finished!`,
    statusCode: 201,
  };
}
