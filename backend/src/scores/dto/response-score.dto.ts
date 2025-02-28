
import { IsInt, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { UserResponseDto } from 'src/users/dtos/response-user.dto'; 
import { UserProgressDto } from 'src/user-progress/dto/user-progress.dto'; 
import { Scores } from '../scores.entity';
// REMOVE THE COMMENT WHEN IMPLEMENTED
// import { PuzzleDto } from '../puzzles/dto/puzzle.dto'; // Adjust the import based on your Puzzle DTO location


export class ScoreResponseDto {
    @IsInt()
    id: number;

    // THE ACTUAL SCORE IS ARRAY OF SCORES -> MODIFY THIS WHEN FIXED
    // @IsInt()
    // @IsNotEmpty()
    // score: number;

    @IsOptional()
    user: UserResponseDto; // Assuming you have a User DTO

    // REMOVE THE COMMENT WHEN IMPLEMENTED
    // @IsOptional()
    // puzzleId: PuzzleDto; 

    @IsOptional()
    userProgress: UserProgressDto; 

    @IsDate()
    createdAt: Date;

    @IsDate()
    update_at: Date;

    static map(entity:Scores|null):ScoreResponseDto{
        if(!entity) return null;
        
        let item = new ScoreResponseDto();
        item.id = entity.id;
        // TODO - FILL USER AND USER PROGRESS DTO WHEN MAPPING FUNCTION IS READY
        // [Add here]
        item.createdAt = entity.createdAt;
        item.update_at = entity.update_at;
        return item;
    }
}
