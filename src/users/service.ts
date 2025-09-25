import { User } from "../models/user";
import { checkUniqueNickname } from "./helper";
import {
  RegistrationUserResult,
  SuccessResponseFindLeaderboardUsers,
} from "./types";

export async function registrationUser(
  nickname: string
): Promise<RegistrationUserResult> {
  await checkUniqueNickname(nickname);
  await User.create({
    nickname,
  });
  return {
    message: `User registered!`,
    statusCode: 201,
  };
}

export async function getLeaderboard(): Promise<SuccessResponseFindLeaderboardUsers> {
  const participants = await User.findAll({
    attributes: ["id", "rating"],
    order: [["rating", "DESC"]],

    raw: true,
    nest: true,
  });

  const result = participants.map((user, index) => ({
    rank: index + 1,
    userId: user.id,
    rating: user.rating,
  }));
  return {
    data: result,
    statusCode: 201,
  };
}
