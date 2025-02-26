import { EventSubscriber, EntitySubscriberInterface, RemoveEvent } from 'typeorm';
import { Level } from 'src/level/entities/level.entity';
import { Puzzles } from 'src/puzzles/puzzles.entity';

@EventSubscriber()
export class PuzzleSubscriber implements EntitySubscriberInterface<Puzzles> {
    listenTo() {
        return Puzzles;
    }

    async beforeRemove(event: RemoveEvent<Puzzles>) {
        if (event.entity) {
            await Level.decrementCount(event.entity.level);
        }
    }
}