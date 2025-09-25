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
SELECT
   p1.user_id AS "user1Id",
   p2.user_id AS "user2Id"
  FROM tournament_participants p1
   JOIN users u1 ON p1.user_id = u1.id
   JOIN tournament_participants p2 ON p1.tournament_id = p2.tournament_id
   JOIN users u2 ON p2.user_id = u2.id
   WHERE p1.tournament_id = $1
    AND p1.is_eliminated = false
    AND u1.is_busy = false
    AND p2.is_eliminated = false
    AND u2.is_busy = false
    AND p1.user_id < p2.user_id  -- чтобы не брать одну и ту же пару дважды
  ORDER BY ABS(u1.rating - u2.rating) ASC, RANDOM()
  LIMIT 1
  FOR SHARE OF u1, u2 SKIP LOCKED;
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
