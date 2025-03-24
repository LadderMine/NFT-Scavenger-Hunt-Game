import { Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import type { ConfigService } from "@nestjs/config"
import { ActivityLog } from "../entities/activity-log.entity"
import { ActivitySeverity, ActivityAction } from "../interfaces/activity-constants"
import type { HttpService } from "@nestjs/axios"
import { catchError, firstValueFrom } from "rxjs"

interface AlertRule {
  id: string
  name: string
  description: string
  conditions: {
    severity?: ActivitySeverity[]
    actions?: ActivityAction[]
    userIds?: string[]
    ipAddresses?: string[]
    threshold?: number
    timeWindowMinutes?: number
  }
  enabled: boolean
  notificationChannels: {
    email?: string[]
    slack?: string
    webhook?: string
  }
}

@Injectable()
export class ActivityAlertService {
  private readonly logger = new Logger(ActivityAlertService.name)
  private alertRules: AlertRule[] = []
  private alertHistory: Map<string, Date> = new Map()
  private readonly cooldownPeriod: number = 15 * 60 * 1000; // 15 minutes

  constructor(
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.loadAlertRules();
  }

  private loadAlertRules() {
    // In a real implementation, this would load from database or config
    // For this example, we'll define some sample rules
    this.alertRules = [
      {
        id: "1",
        name: "Critical Security Events",
        description: "Alert on any critical security events",
        conditions: {
          severity: [ActivitySeverity.CRITICAL],
        },
        enabled: true,
        notificationChannels: {
          email: ["security@example.com"],
        },
      },
      {
        id: "2",
        name: "Multiple Failed Logins",
        description: "Alert on multiple failed login attempts",
        conditions: {
          actions: [ActivityAction.USER_LOGIN],
          threshold: 5,
          timeWindowMinutes: 10,
        },
        enabled: true,
        notificationChannels: {
          slack: this.configService.get("SLACK_WEBHOOK_URL"),
        },
      },
      {
        id: "3",
        name: "Suspicious IP Activity",
        description: "Alert on activity from suspicious IPs",
        conditions: {
          ipAddresses: ["192.168.1.1"], // Example IP
        },
        enabled: true,
        notificationChannels: {
          webhook: this.configService.get("SECURITY_WEBHOOK_URL"),
        },
      },
    ]
  }

  async processActivityLog(log: ActivityLog): Promise<void> {
    for (const rule of this.alertRules) {
      if (!rule.enabled) continue

      if (await this.matchesRule(log, rule)) {
        await this.triggerAlert(log, rule)
      }
    }
  }

  private async matchesRule(log: ActivityLog, rule: AlertRule): Promise<boolean> {
    const { conditions } = rule

    // Check severity
    if (conditions.severity && conditions.severity.length > 0) {
      if (!conditions.severity.includes(log.severity)) {
        return false
      }
    }

    // Check actions
    if (conditions.actions && conditions.actions.length > 0) {
      if (!conditions.actions.includes(log.action)) {
        return false
      }
    }

    // Check userIds
    if (conditions.userIds && conditions.userIds.length > 0) {
      if (!log.userId || !conditions.userIds.includes(log.userId)) {
        return false
      }
    }

    // Check IP addresses
    if (conditions.ipAddresses && conditions.ipAddresses.length > 0) {
      if (!log.ipAddress || !conditions.ipAddresses.includes(log.ipAddress)) {
        return false
      }
    }

    // Check threshold within time window
    if (conditions.threshold && conditions.timeWindowMinutes) {
      const timeWindow = new Date()
      timeWindow.setMinutes(timeWindow.getMinutes() - conditions.timeWindowMinutes)

      const count = await this.activityLogRepository.count({
        where: {
          action: log.action,
          userId: log.userId,
          createdAt: { $gte: timeWindow } as any,
        },
      })

      if (count < conditions.threshold) {
        return false
      }
    }

    return true
  }

  private async triggerAlert(log: ActivityLog, rule: AlertRule): Promise<void> {
    // Check if we're in cooldown period for this rule
    const lastAlertTime = this.alertHistory.get(rule.id)
    const now = new Date()

    if (lastAlertTime && now.getTime() - lastAlertTime.getTime() < this.cooldownPeriod) {
      this.logger.debug(`Alert for rule ${rule.name} is in cooldown period`)
      return
    }

    // Update alert history
    this.alertHistory.set(rule.id, now)

    const alertMessage = this.formatAlertMessage(log, rule)

    // Send notifications based on configured channels
    const { notificationChannels } = rule

    try {
      if (notificationChannels.email && notificationChannels.email.length > 0) {
        await this.sendEmailAlert(notificationChannels.email, alertMessage, log, rule)
      }

      if (notificationChannels.slack) {
        await this.sendSlackAlert(notificationChannels.slack, alertMessage, log, rule)
      }

      if (notificationChannels.webhook) {
        await this.sendWebhookAlert(notificationChannels.webhook, alertMessage, log, rule)
      }

      this.logger.log(`Alert triggered: ${rule.name}`)
    } catch (error) {
      this.logger.error(`Failed to send alert: ${error.message}`)
    }
  }

  private formatAlertMessage(log: ActivityLog, rule: AlertRule): string {
    return `
      Alert: ${rule.name}
      Description: ${rule.description}
      Severity: ${log.severity}
      Action: ${log.action}
      User ID: ${log.userId || "Anonymous"}
      IP Address: ${log.ipAddress || "Unknown"}
      Time: ${log.createdAt.toISOString()}
      Details: ${JSON.stringify(log.metadata)}
    `
  }

  private async sendEmailAlert(
    recipients: string[],
    message: string,
    log: ActivityLog,
    rule: AlertRule,
  ): Promise<void> {
    // In a real implementation, this would use a mail service
    this.logger.log(`Would send email to ${recipients.join(", ")}: ${message}`)
  }

  private async sendSlackAlert(webhookUrl: string, message: string, log: ActivityLog, rule: AlertRule): Promise<void> {
    if (!webhookUrl) {
      this.logger.warn("No Slack webhook URL configured")
      return
    }

    try {
      await firstValueFrom(
        this.httpService
          .post(webhookUrl, {
            text: message,
            attachments: [
              {
                color: this.getSeverityColor(log.severity),
                fields: [
                  {
                    title: "Action",
                    value: log.action,
                    short: true,
                  },
                  {
                    title: "User ID",
                    value: log.userId || "Anonymous",
                    short: true,
                  },
                  {
                    title: "IP Address",
                    value: log.ipAddress || "Unknown",
                    short: true,
                  },
                  {
                    title: "Time",
                    value: log.createdAt.toISOString(),
                    short: true,
                  },
                ],
              },
            ],
          })
          .pipe(
            catchError((error) => {
              this.logger.error(`Failed to send Slack alert: ${error.message}`)
              throw error
            }),
          ),
      )
    } catch (error) {
      this.logger.error(`Error sending Slack alert: ${error.message}`)
    }
  }

  private async sendWebhookAlert(
    webhookUrl: string,
    message: string,
    log: ActivityLog,
    rule: AlertRule,
  ): Promise<void> {
    if (!webhookUrl) {
      this.logger.warn("No webhook URL configured")
      return
    }

    try {
      await firstValueFrom(
        this.httpService
          .post(webhookUrl, {
            alert: {
              ruleName: rule.name,
              ruleId: rule.id,
              message,
              severity: log.severity,
              timestamp: new Date().toISOString(),
            },
            activity: {
              id: log.id,
              userId: log.userId,
              action: log.action,
              category: log.category,
              severity: log.severity,
              ipAddress: log.ipAddress,
              userAgent: log.userAgent,
              metadata: log.metadata,
              createdAt: log.createdAt,
            },
          })
          .pipe(
            catchError((error) => {
              this.logger.error(`Failed to send webhook alert: ${error.message}`)
              throw error
            }),
          ),
      )
    } catch (error) {
      this.logger.error(`Error sending webhook alert: ${error.message}`)
    }
  }

  private getSeverityColor(severity: ActivitySeverity): string {
    switch (severity) {
      case ActivitySeverity.CRITICAL:
        return "#FF0000" // Red
      case ActivitySeverity.ERROR:
        return "#FFA500" // Orange
      case ActivitySeverity.WARNING:
        return "#FFFF00" // Yellow
      case ActivitySeverity.NOTICE:
        return "#1E90FF" // Blue
      case ActivitySeverity.INFO:
        return "#00FF00" // Green
      case ActivitySeverity.DEBUG:
        return "#808080" // Gray
      default:
        return "#808080" // Gray
    }
  }
}

