import { Injectable } from '@nestjs/common';
import { Token } from './entities/token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTokenDto } from './dto/create-token.dto';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async save(createTokenDto: CreateTokenDto): Promise<Token> {
    return this.tokenRepository.save(createTokenDto);
  }

  async findOne(userId: number) {
    return this.tokenRepository.findOne({
      where: {
        userId: userId,
      },
    });
  }
}
