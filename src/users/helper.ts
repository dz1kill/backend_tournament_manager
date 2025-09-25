import { User } from "../models/user";

export async function checkUniqueNickname(nickname: string): Promise<void> {
  const findUser = await User.findOne({ where: { nickname } });
  if (findUser) {
    throw {
      message: "User with this nickname already exists!",
      statusCode: 409,
    };
  }
}
