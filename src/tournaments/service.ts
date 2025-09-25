import sequelize from "../models";
import { Tournament, TournamentStatus } from "../models/tournament";
import { TournamentParticipant } from "../models/tournament_participant";
import {
  checkStatusTournament,
  checkTournament,
  checkUniqueTournaments,
  checkUser,
  createMatch,
  findAvailableTournamentUsers,
  setUsersBusy,
  tournamentUpdateStatus,
} from "./helper";
import {
  AddUserToTournamentResult,
  SuccessResponseFindLeaderboard,
  SuccessResponseFindTournaments,
  TournamentCreateResult,
  TournamentFinishResult,
  TournamentRunResult,
} from "./types";

export async function newTournament(
  name: string
): Promise<TournamentCreateResult> {
  await checkUniqueTournaments(name);
  await Tournament.create({
    name,
  });
  return {
    message: `Tournament created!`,
    statusCode: 201,
  };
}

export async function closeTournament(
  tournamentId: number
): Promise<TournamentFinishResult> {
  await checkTournament(tournamentId);
  await Tournament.update(
    {
      status: TournamentStatus.Finished,
      finishedAt: new Date(),
    },
    {
      where: { id: tournamentId },
    }
  );
  return {
    message: `Tournament Finished!`,
    statusCode: 201,
  };
}

export async function findTournamentsByStatus(
  status: TournamentStatus
): Promise<SuccessResponseFindTournaments> {
  let tournaments: Tournament[];
  if (status) {
    tournaments = await Tournament.findAll({
      where: { status },
    });
  } else {
    tournaments = await Tournament.findAll();
  }
  return {
    data: tournaments,
    statusCode: 200,
  };
}

export async function addUserToTournament(
  userId: number,
  tournamentId: number
): Promise<AddUserToTournamentResult> {
  await checkTournament(tournamentId);
  await checkUser(userId);
  const status = await checkStatusTournament(tournamentId);
  if (status !== TournamentStatus.Pending) {
    throw {
      message: "The tournament is not available for registration",
      statusCode: 409,
    };
  }

  await TournamentParticipant.create({ tournamentId, userId });

  return {
    message: "User add tournament",
    statusCode: 201,
  };
}

export async function runTournament(
  tournamentId: number
): Promise<TournamentRunResult> {
  await checkTournament(tournamentId);
  await tournamentUpdateStatus(tournamentId);

  let isRunning = true;

  async function autoMatchmaking() {
    const status = await checkStatusTournament(tournamentId);

    if (status !== TournamentStatus.Running) {
      isRunning = false;
    }

    return await sequelize.transaction(async (transaction) => {
      const availableUsers = await findAvailableTournamentUsers(
        tournamentId,
        transaction
      );

      if (availableUsers.length < 2) {
        const activeParticipantsCount = await TournamentParticipant.count({
          where: {
            tournamentId,
            isEliminated: false,
          },
        });

        if (activeParticipantsCount < 2) {
          isRunning = false;
          closeTournament(tournamentId);
        }
        return { createdMatch: false };
      }

      await setUsersBusy(availableUsers, transaction);
      await createMatch(tournamentId, availableUsers, transaction);

      return { createdMatch: true };
    });
  }

  async function matchmakingLoop() {
    let delay = 500;
    const minDelay = 200;
    const maxDelay = 10000;

    while (isRunning) {
      try {
        const result = await autoMatchmaking();

        if (result?.createdMatch) {
          delay = Math.max(minDelay, Math.floor(delay / 2));
        } else {
          delay = Math.min(maxDelay, delay * 2);
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (error) {
        console.error("Error in matchmaking loop:", error);
      }
    }
  }

  matchmakingLoop().catch(console.error);

  return {
    message: `Tournament started!`,
    statusCode: 201,
  };
}

export async function getLeaderboard(
  tournamentId: number
): Promise<SuccessResponseFindLeaderboard> {
  checkTournament(tournamentId);
  const participants = await TournamentParticipant.findAll({
    where: {
      tournamentId: tournamentId,
    },

    attributes: ["userId", "score"],
    order: [["score", "DESC"]],

    raw: true,
    nest: true,
  });

  const result = participants.map((user, index) => ({
    rank: index + 1,
    userId: user.userId,
    score: user.score,
  }));

  return {
    data: result,
    statusCode: 200,
  };
}
