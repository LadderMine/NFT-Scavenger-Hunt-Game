import { IsInt, IsNotEmpty } from "class-validator";
import { CreateUserDto } from "./create-user-dto.dto";
import {PartialType} from '@nestjs/mapped-types'

export class UpdateUserDto extends PartialType (CreateUserDto){
    @IsNotEmpty()
    @IsInt()
    id:number
}