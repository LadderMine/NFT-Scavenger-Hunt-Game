export interface PuzzleData {
  title: string
  description?: string
  difficulty: "easy" | "medium" | "hard" | "expert"
  category: string
  content: PuzzleContent
  metadata?: PuzzleMetadata
  tags?: string[]
  isActive?: boolean
}

export interface PuzzleContent {
  question: string
  answer: string
  hints?: string[]
  explanation?: string
  options?: string[] // For multiple choice
  type: "text" | "multiple_choice" | "code" | "math" | "logic"
}

export interface PuzzleMetadata {
  author?: string
  source?: string
  createdAt?: string
  estimatedTime?: number // in minutes
  points?: number
}

export interface ParseResult {
  success: boolean
  data?: PuzzleData[]
  errors: ParseError[]
  summary: {
    totalRecords: number
    validRecords: number
    invalidRecords: number
  }
}

export interface ParseError {
  index: number
  field?: string
  message: string
  data?: any
}

export interface MigrationResult {
  success: boolean
  summary: {
    totalProcessed: number
    successfulInserts: number
    failedInserts: number
    duplicatesSkipped: number
  }
  errors: MigrationError[]
  uploadInfo: {
    filename: string
    fileSize: number
    uploadedAt: Date
    uploadedBy: string
  }
}

export interface MigrationError {
  index: number
  puzzle: Partial<PuzzleData>
  error: string
}
