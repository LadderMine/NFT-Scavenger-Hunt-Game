import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answers } from './answers.entity';
import { Repository } from 'typeorm';
import { HintsService } from 'src/hints/hints.service';

@Injectable()


export class AnswersService {
    constructor( 
        @InjectRepository(Answers)
        private answersRepository: Repository<Answers>,
        
        private readonly hintsService: HintsService
    ){}
}
