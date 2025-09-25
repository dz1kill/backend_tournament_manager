import sequelize from "../models";
import { Match } from "../models/match";
import { TournamentParticipant } from "../models/tournament_participant";
import { User } from "../models/user";

export async function matchFinish(
  winnerUserId: number,
  matchId: number,
  transaction
) {
  const [matchUpdated] = await Match.update(
    { winnerId: winnerUserId },
    {
      where: { id: matchId },
      transaction,
    }
  );
  if (matchUpdated === 0) {
    throw {
      message: `Match not found`,
      statusCode: 404,
    };
  }
}

export async function addScoreUserToTournament(
  tournamentId: number,
  winnerUserId: number,
  transaction,
  pointsToAdd: number
) {
  const [participantUpdated] = await TournamentParticipant.update(
    { score: sequelize.literal(`score + ${pointsToAdd}`) },
    {
      where: {
        tournamentId: tournamentId,
        userId: winnerUserId,
      },
      transaction,
    }
  );

  if (participantUpdated === 0) {
    throw {
      message: "Participant or user not found ",
      statusCode: 404,
    };
  }
}

export async function addScoreToUser(
  winnerUserId: number,
  pointsToAdd: number,
  transaction
) {
  const [userUpdated] = await User.update(
    { rating: sequelize.literal(`rating + ${pointsToAdd}`) },
    {
      where: { id: winnerUserId },
      transaction,
    }
  );

  if (userUpdated === 0) {
    throw {
      message: "User not found",
      statusCode: 404,
    };
  }
}

export async function addDataLoser(
  loserId: number,
  tournamentId: number,
  transaction
) {
  const [participantUpdated] = await TournamentParticipant.update(
    { isEliminated: true },
    {
      where: {
        tournamentId: tournamentId,
        userId: loserId,
      },
      transaction,
    }
  );

  if (participantUpdated === 0) {
    throw {
      message: "Participant or user not found ",
      statusCode: 404,
    };
  }
}
