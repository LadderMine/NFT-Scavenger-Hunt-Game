import { ApiProperty } from "@nestjs/swagger"

export class ReactionAggregationDto {
  @ApiProperty({
    description: "Content ID",
    example: "puzzle-123",
  })
  contentId: string

  @ApiProperty({
    description: "Reaction counts per emoji",
    example: {
      "👍": 15,
      "❤️": 8,
      "🤔": 3,
    },
  })
  reactions: Record<string, number>

  @ApiProperty({
    description: "Total reaction count",
    example: 26,
  })
  totalReactions: number
}
