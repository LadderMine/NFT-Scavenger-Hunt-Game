import { Injectable, Logger } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import { FraudDetectionEvents } from "./fraud-detection-event.emitter"

@Injectable()
export class FraudDetectionEventListener {
  private readonly logger = new Logger(FraudDetectionEventListener.name)

  @OnEvent(FraudDetectionEvents.SUSPECT_DETECTED)
  handleSuspectDetected(payload: any): void {
    this.logger.warn(
      `Fraud suspect detected: User ${payload.suspect.userId} with risk score ${payload.suspect.riskScore}`,
    )

    // Here you could implement notification logic:
    // - Send email to admin
    // - Send Slack notification
    // - Log to external monitoring system
  }

  @OnEvent(FraudDetectionEvents.FRAUD_ACTIVITY_DETECTED)
  handleFraudActivityDetected(payload: any): void {
    this.logger.warn(
      `Fraud activity detected: ${payload.activity.type} with severity ${payload.activity.severityScore}`,
    )

    // For high severity activities, you might want to trigger immediate actions
    if (payload.activity.severityScore > 80) {
      this.triggerHighSeverityAlert(payload.activity)
    }
  }

  @OnEvent(FraudDetectionEvents.SUSPECT_REVIEWED)
  handleSuspectReviewed(payload: any): void {
    this.logger.log(
      `Fraud suspect reviewed: User ${payload.suspect.userId} marked as ${payload.suspect.status} by ${payload.suspect.reviewedBy}`,
    )

    // You could implement follow-up actions based on review status
    if (payload.suspect.status === "confirmed") {
      this.handleConfirmedFraudCase(payload.suspect)
    }
  }

  private triggerHighSeverityAlert(activity: any): void {
    // Implement high priority notification logic
    this.logger.error(`HIGH SEVERITY FRAUD DETECTED: ${JSON.stringify(activity)}`)

    // In a real implementation, you might:
    // - Send SMS to security team
    // - Create high-priority ticket in your issue tracker
    // - Trigger automatic account suspension
  }

  private handleConfirmedFraudCase(suspect: any): void {
    // Implement actions for confirmed fraud cases
    this.logger.log(`Taking action for confirmed fraud: ${suspect.userId}`)

    // In a real implementation, you might:
    // - Disable the user account
    // - Invalidate referral bonuses
    // - Add to a blocklist
  }
}

