import { ApiProperty } from "@nestjs/swagger"

export class SettingsCategoriesDto {
  @ApiProperty({
    description: "Available languages",
    example: [
      { value: "en", label: "English" },
      { value: "es", label: "Español" },
      { value: "fr", label: "Français" },
    ],
  })
  languages: Array<{ value: string; label: string }>

  @ApiProperty({
    description: "Available themes",
    example: [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
      { value: "auto", label: "Auto" },
    ],
  })
  themes: Array<{ value: string; label: string }>

  @ApiProperty({
    description: "Available notification frequencies",
    example: [
      { value: "immediate", label: "Immediate" },
      { value: "hourly", label: "Hourly" },
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "never", label: "Never" },
    ],
  })
  notificationFrequencies: Array<{ value: string; label: string }>

  @ApiProperty({
    description: "Available volume levels",
    example: [
      { value: 0, label: "Muted" },
      { value: 25, label: "Low" },
      { value: 50, label: "Medium" },
      { value: 75, label: "High" },
      { value: 100, label: "Max" },
    ],
  })
  volumeLevels: Array<{ value: number; label: string }>

  @ApiProperty({
    description: "Available difficulty levels",
    example: [
      { value: "easy", label: "Easy" },
      { value: "normal", label: "Normal" },
      { value: "hard", label: "Hard" },
      { value: "expert", label: "Expert" },
    ],
  })
  difficultyLevels: Array<{ value: string; label: string }>

  @ApiProperty({
    description: "Available time formats",
    example: [
      { value: "12h", label: "12 Hour" },
      { value: "24h", label: "24 Hour" },
    ],
  })
  timeFormats: Array<{ value: string; label: string }>

  @ApiProperty({
    description: "Available date formats",
    example: [
      { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
      { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
      { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
    ],
  })
  dateFormats: Array<{ value: string; label: string }>
}
