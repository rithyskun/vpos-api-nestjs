import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export enum tokenType {
  Bearer,
}

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column({ type: 'enum', enum: tokenType })
  type: tokenType.Bearer;

  @Column()
  expired: boolean;

  @Column()
  revoked: boolean;

  @Column()
  ipAddress: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
