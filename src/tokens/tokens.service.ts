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

  async createToken(createTokenDto: CreateTokenDto): Promise<Token> {
    return this.tokenRepository.save(createTokenDto);
  }
}
