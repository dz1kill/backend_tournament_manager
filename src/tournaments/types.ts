import { Tournament, TournamentStatus } from "../models/tournament";

export type CreateTournamentDTO = {
  body: {
    name: string;
  };
};

export type startTournamentDTO = {
  params: { tournamentId: number };
};

export type getTournamentDTO = {
  query?: { data: TournamentStatus };
};

export type registerTournamentDTO = {
  body: {
    tournamentId: number;
    userId: number;
  };
};

interface SuccessResponse {
  message: string;
  statusCode: number;
}

interface ErrorResponse {
  message: string;
  statusCode: number;
}

export interface SuccessResponseFindTournaments {
  data: Tournament[];
  statusCode: number;
}
export type FindLeaderboardData = {
  params: { id: string };
};

export interface SuccessResponseFindLeaderboard {
  data: {
    rank: number;
    userId: number;
    score: number;
  }[];
  statusCode: number;
}

export type TournamentCreateResult = SuccessResponse | ErrorResponse;

export type TournamentRunResult = SuccessResponse | ErrorResponse;

export type TournamentFinishResult = SuccessResponse | ErrorResponse;

export type AddUserToTournamentResult = SuccessResponse | ErrorResponse;
