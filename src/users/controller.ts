import { getLeaderboard, registrationUser } from "./service";
import { RegistrationDTO, RegistrationUserResult } from "./types";
import * as express from "express";

export async function registration(
  req: RegistrationDTO,
  res: express.Response
): Promise<void> {
  try {
    const { nickname } = req.body;
    const result: RegistrationUserResult = await registrationUser(nickname);
    res.status(result.statusCode || 200).json({ message: result.message });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}

export async function findLeaderboard(
  req: express.Request,
  res: express.Response
): Promise<void> {
  try {
    const result = await getLeaderboard();
    res.status(result.statusCode || 200).json({ data: result.data });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
}
