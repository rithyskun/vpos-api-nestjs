import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ length: 500 })
  firstName: string;

  @ApiProperty()
  @Column({ length: 500 })
  lastName: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  @Exclude()
  password: string;

  @ApiProperty({ required: false })
  @Column()
  status: boolean;

  @ApiProperty()
  @Column()
  roles: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
