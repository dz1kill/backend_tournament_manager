export type RegistrationDTO = {
  body: {
    nickname: string;
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

export type RegistrationUserResult = SuccessResponse | ErrorResponse;

export interface SuccessResponseFindLeaderboardUsers {
  data: {
    rank: number;
    userId: number;
    rating: number;
  }[];
  statusCode: number;
}
