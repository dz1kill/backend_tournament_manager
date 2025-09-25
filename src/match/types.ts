export type FinishMatchDTO = {
  body: {
    winnerUserId: number;
    matchId: number;
    tournamentId: number;
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

export type FinishMatchResult = SuccessResponse | ErrorResponse;
