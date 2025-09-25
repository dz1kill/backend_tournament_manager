import * as express from "express";
import { users } from "./users/routes";
import { tournaments } from "./tournaments/routes";
import { matches } from "./match/router";

export const router: express.IRouter = express.Router();

router.use("/users", users);
router.use("/tournaments", tournaments);
router.use("/matches", matches);
