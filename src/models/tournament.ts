import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { TournamentParticipant } from "./tournament_participant";
import { Match } from "./match";

export enum TournamentStatus {
  Pending = "pending",
  Running = "running",
  Finished = "finished",
}

@Table({ tableName: "tournaments", timestamps: true, underscored: true })
export class Tournament extends Model<Tournament> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(TournamentStatus)),
    allowNull: false,
    defaultValue: TournamentStatus.Pending,
  })
  status: TournamentStatus;

  @Column(DataType.DATE)
  startedAt: Date;

  @Column(DataType.DATE)
  finishedAt: Date;

  @HasMany(() => TournamentParticipant)
  participants: TournamentParticipant[];

  @HasMany(() => Match)
  matches: Match[];
}
