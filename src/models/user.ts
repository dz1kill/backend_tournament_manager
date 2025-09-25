import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { TournamentParticipant } from "./tournament_participant";
import { Match } from "./match";

@Table({ tableName: "users", timestamps: true })
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  nickname: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  rating: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isBusy: boolean;

  @HasMany(() => TournamentParticipant)
  participations: TournamentParticipant[];

  @HasMany(() => Match, "player1_id")
  matchesAsPlayer1: Match[];

  @HasMany(() => Match, "player2_id")
  matchesAsPlayer2: Match[];

  @HasMany(() => Match, "winner_id")
  matchesAsWinner: Match[];
}
