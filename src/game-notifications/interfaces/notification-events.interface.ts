export interface NotificationEventPayload {
  id: string
  title: string
  message: string
  status: string
  data?: Record<string, any>
  createdAt: Date
}

export interface BroadcastNotificationPayload {
  id: string
  title: string
  message: string
  data?: Record<string, any>
  createdAt: Date
}

export interface UserJoinPayload {
  userId: string
}

export interface UserLeavePayload {
  userId: string
}
