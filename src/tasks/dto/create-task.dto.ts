import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength } from "class-validator"

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @MinLength(1)
    @MaxLength(100)
    title?: string

    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional()
    completed: boolean = false
    
}
