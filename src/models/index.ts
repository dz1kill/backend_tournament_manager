import * as config from "config";
import { Sequelize } from "sequelize-typescript";
import { User } from "./user";
import { Tournament } from "./tournament";
import { TournamentParticipant } from "./tournament_participant";
import { Match } from "./match";

const sequelize = new Sequelize({
  dialect: config.get("DBconfig.dialect"),
  host: config.get("DBconfig.host"),
  username: config.get("DBconfig.username"),
  password: config.get("DBconfig.password"),
  database: config.get("DBconfig.database"),
  models: [User, Tournament, TournamentParticipant, Match],
  define: {
    underscored: true,
  },
});

export default sequelize;
