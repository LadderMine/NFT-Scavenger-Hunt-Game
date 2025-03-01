import { IsDate, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { UserProgressDto } from "src/user-progress/dto/user-progress.dto";
import { UserResponseDto } from "src/users/dtos/response-user.dto";
import { Scores } from "../scores.entity";


export class UpdateScoreDto {
    
    @IsInt()
    @IsNotEmpty()
    score: number;

    // Add other properties if required
}
