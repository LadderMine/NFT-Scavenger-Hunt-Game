import { Injectable } from "@nestjs/common"
import type { EventEmitter2 } from "@nestjs/event-emitter"

@Injectable()
export class EventEmitterService {
  constructor(private eventEmitter: EventEmitter2) {}

  emit(event: string, payload: any): boolean {
    return this.eventEmitter.emit(event, payload)
  }
}

