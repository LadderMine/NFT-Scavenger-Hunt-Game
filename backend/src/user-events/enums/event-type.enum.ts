export enum EventType {
  // Puzzle Events
  PUZZLE_OPENED = "puzzle_opened",
  PUZZLE_COMPLETED = "puzzle_completed",
  PUZZLE_FAILED = "puzzle_failed",
  PUZZLE_ABANDONED = "puzzle_abandoned",

  // Hint Events
  HINT_USED = "hint_used",
  HINT_VIEWED = "hint_viewed",
  HINT_PURCHASED = "hint_purchased",

  // NFT Events
  NFT_CLAIMED = "nft_claimed",
  NFT_VIEWED = "nft_viewed",
  NFT_TRANSFERRED = "nft_transferred",

  // User Events
  USER_LOGIN = "user_login",
  USER_LOGOUT = "user_logout",
  USER_REGISTERED = "user_registered",
  USER_PROFILE_UPDATED = "user_profile_updated",

  // Game Progress Events
  LEVEL_COMPLETED = "level_completed",
  LEVEL_STARTED = "level_started",
  SCORE_ACHIEVED = "score_achieved",
  RANK_CHANGED = "rank_changed",

  // Social Events
  FRIEND_INVITED = "friend_invited",
  FRIEND_ACCEPTED = "friend_accepted",
  MESSAGE_SENT = "message_sent",

  // Transaction Events
  PAYMENT_COMPLETED = "payment_completed",
  PAYMENT_FAILED = "payment_failed",
  SUBSCRIPTION_STARTED = "subscription_started",
  SUBSCRIPTION_CANCELLED = "subscription_cancelled",

  // System Events
  ERROR_OCCURRED = "error_occurred",
  FEATURE_USED = "feature_used",
  PAGE_VIEWED = "page_viewed",
}
