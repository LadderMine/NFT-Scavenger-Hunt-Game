import { IsObject, IsString, IsUUID } from "class-validator";

export class StartPreviewDto {
    @IsUUID()
    creatorId: string;
  
    @IsObject()
    puzzleData: any;
  }
  
  export class SubmitAnswerDto {
    @IsUUID()
    sessionId: string;
  
    @IsString()
    answer: string;
  }
  