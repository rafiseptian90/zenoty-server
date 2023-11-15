import { IsNotEmpty, IsDate, IsString, IsOptional, IsISO8601 } from 'class-validator';
import { Transform } from 'class-transformer'; 

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    public title: string;

    @IsString()
    @IsOptional()
    public description?: string;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    public date: string;
}
