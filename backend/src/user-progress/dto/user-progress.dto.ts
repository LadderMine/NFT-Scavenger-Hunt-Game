import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsDate } from 'class-validator';  
import { Type } from 'class-transformer';  

export class UserProgressDto {  
  @IsOptional()  
  @IsInt()  
  @IsPositive()  
  id?: number;  

  @IsNotEmpty()  
  @IsInt()  
  @IsPositive() 
  userId: number;  

  @IsNotEmpty()  
  @IsInt() 
  @IsPositive() 
  puzzleId: number;  

  @IsOptional()  
  @IsInt()
  @IsPositive()  
  hintsId?: number;  

  @IsBoolean()  
  completed: boolean;  

  @IsInt()  
  @IsPositive()  
  hintsUsed: number;  

  @IsOptional()  
  @IsDate()  
  @Type(() => Date) 
  lastUpdated?: Date;

  @IsInt()  
  @IsPositive()  
  score: number;
 
}