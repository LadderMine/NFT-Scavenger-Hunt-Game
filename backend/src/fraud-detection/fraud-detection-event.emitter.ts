import { Injectable } from '@nestjs/common';
import type { EventEmitter2 } from '@nestjs/event-emitter';
import type { FraudSuspect } from './entities/fraud-suspect.entity';
import type { FraudActivity } from './entities/fraud-activity.entity';

export enum FraudDetectionEvents {
  SUSPECT_DETECTED = 'fraud.suspect.detected',
  FRAUD_ACTIVITY_DETECTED = 'fraud.activity.detected',
  SUSPECT_REVIEWED = 'fraud.suspect.reviewed',
}

@Injectable()
export class FraudDetectionEventEmitter {
  constructor(private eventEmitter: EventEmitter2) {}

  emitSuspectDetected(suspect: FraudSuspect): void {
    this.eventEmitter.emit(FraudDetectionEvents.SUSPECT_DETECTED, {
      suspect,
      timestamp: new Date(),
    });
  }

  emitFraudActivityDetected(activity: FraudActivity): void {
    this.eventEmitter.emit(FraudDetectionEvents.FRAUD_ACTIVITY_DETECTED, {
      activity,
      timestamp: new Date(),
    });
  }

  emitSuspectReviewed(suspect: FraudSuspect): void {
    this.eventEmitter.emit(FraudDetectionEvents.SUSPECT_REVIEWED, {
      suspect,
      timestamp: new Date(),
    });
  }
}
