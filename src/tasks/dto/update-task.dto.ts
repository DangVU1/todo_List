import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PutUpdateTaskDto extends PartialType(CreateTaskDto) {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title?: string

    @IsBoolean()
    @ApiProperty()
    completed?: boolean = false
}

export class PatchUpdateTaskDto extends PartialType(CreateTaskDto) {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    title?: string 

    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional()
    completed?: boolean = false
}
