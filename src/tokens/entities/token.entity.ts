import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum tokenType {
  Bearer,
}

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  expired: boolean;

  @Column()
  revoked: boolean;

  @Column()
  ipAddress?: string;

  @Column()
  createdAt: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.token)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User[];
}
