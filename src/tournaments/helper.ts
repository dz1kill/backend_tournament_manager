import { Tournament, TournamentStatus } from "../models/tournament";
import { User } from "../models/user";
import { Match } from "../models/match";
import sequelize from "../models";
import { QueryTypes } from "sequelize";

export async function checkUniqueTournaments(name: string): Promise<void> {
  const findTournament = await Tournament.findOne({ where: { name } });
  if (findTournament) {
    throw {
      message: "Tournament with this name already exists!",
      statusCode: 409,
    };
  }
}

export async function tournamentUpdateStatus(tournamentId) {
  await Tournament.update(
    {
      status: TournamentStatus.Running,
      startedAt: new Date(),
    },
    {
      where: { id: tournamentId },
    }
  );
}

export async function checkTournament(id: number): Promise<void> {
  const findTournament = await Tournament.findOne({ where: { id } });
  if (!findTournament) {
    throw {
      message: "Tournament not found.",
      statusCode: 404,
    };
  }
}

export async function checkUser(id: number): Promise<void> {
  const findUser = await User.findOne({ where: { id } });
  if (!findUser) {
    throw {
      message: "User not found.",
      statusCode: 404,
    };
  }
}

export async function checkStatusTournament(id: number) {
  const findTournament = await Tournament.findOne({
    where: { id },
    attributes: ["status"],
    raw: true,
  });

  return findTournament.status;
}

export async function findAvailableTournamentUsers(
  tournamentId: number,
  transaction: any
) {
  const query = `
  SELECT tp.user_id AS "userId"
    FROM tournament_participants tp
    INNER JOIN users u ON tp.user_id = u.id
    WHERE tp.tournament_id = $1
      AND tp.is_eliminated = false
      AND u.is_busy = false
    ORDER BY -LOG(RANDOM()) / NULLIF(u.rating, 0)
    LIMIT 2
    FOR SHARE OF u SKIP LOCKED;

  `;

  const results = await sequelize.query(query, {
    bind: [tournamentId],
    transaction,
    type: QueryTypes.SELECT,
  });

  return results.map((row: any) => row.userId);
}

export async function setUsersBusy(userIds: number[], transaction) {
  await User.update(
    { isBusy: true },
    {
      where: {
        id: userIds,
      },
      transaction,
    }
  );
}

export async function createMatch(
  tournamentId: number,
  availableUsers: number[],
  transaction
) {
  await Match.create(
    {
      tournamentId: tournamentId,
      player1Id: availableUsers[0],
      player2Id: availableUsers[1],
    },
    transaction
  );
}
