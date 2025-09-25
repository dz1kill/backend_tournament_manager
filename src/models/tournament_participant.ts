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

@Table({
  tableName: "tournament_participants",
  timestamps: true,
  underscored: true,
})
export class TournamentParticipant extends Model<TournamentParticipant> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Tournament)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  tournamentId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  score: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isEliminated: boolean;

  @BelongsTo(() => Tournament)
  tournament: Tournament;

  @BelongsTo(() => User)
  user: User;
}
