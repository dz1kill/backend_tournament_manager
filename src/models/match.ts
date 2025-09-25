import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Tournament } from "./tournament";
import { User } from "./user";

@Table({ tableName: "matches", timestamps: true })
export class Match extends Model<Match> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Tournament)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  tournamentId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  player1Id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  player2Id: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  winnerId: number;

  @BelongsTo(() => Tournament)
  tournament: Tournament;

  @BelongsTo(() => User, "player1_id")
  player1: User;

  @BelongsTo(() => User, "player2_id")
  player2: User;

  @BelongsTo(() => User, "winner_id")
  winner: User;
}
