import { Injectable } from '@nestjs/common';
import { UpdateHintDto } from './dto/update-hint.dto';
import { Hints } from './hints.entity';

@Injectable()
export class HintsService {
    private hints: Hints[] = []; // Simulating a database

    async findById(id: string): Promise<Hints | undefined> {
        return this.hints.find((hint) => hint.id.toString() === id);
    }

    async updateHint(id: string, updateHintDto: UpdateHintDto): Promise<Hints | null> {
        const hint = await this.findById(id);
        if (!hint) return null;

        Object.assign(hint, updateHintDto);
        return hint;
    }
}
