import { ApiPropertyOptional } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsOptional,IsString, Min,IsBoolean,IsIn, Max, IsInt, IsNotEmpty } from "class-validator"

export class GetTasksQueryDto {
    @Type(()=>Number)
    @Min(1)
    @IsOptional()
    @IsInt()
    @ApiPropertyOptional({
        example: 1,
    })
    page?: number 

    @IsOptional()
    @Min(1)
    @Max(50)
    @IsInt()
    @Type(()=>Number)
    @ApiPropertyOptional({
        example: 5,
    })
    limit?: number

    
    @IsOptional()
    @ApiPropertyOptional()
    @Transform(({value})=>{
        if(value === "true") return true
        if(value === "false") return false
        return value;
    })
    @IsBoolean()
    completed?: boolean

    @IsString()
    @IsOptional()
    @IsIn(['createdAt','title','id'])
    @ApiPropertyOptional()
    sortBy?: string

    @IsOptional()
    @IsString()
    @IsIn(['desc','asc'])
    @ApiPropertyOptional()
    sortOrder?: 'desc' |  'asc'

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @ApiPropertyOptional()
    search?: string
}