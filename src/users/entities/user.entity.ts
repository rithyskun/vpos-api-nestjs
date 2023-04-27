import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Token } from 'src/tokens/entities/token.entity';
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

  @OneToMany(() => Token, (token) => token.user)
  token: Token;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
