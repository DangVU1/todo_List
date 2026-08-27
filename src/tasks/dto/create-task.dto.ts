import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Min, Max } from "class-validator"

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title?: string

    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional()
    completed: boolean = false
    
}
