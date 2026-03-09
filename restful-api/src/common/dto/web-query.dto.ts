import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class WebQuery {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsIn([10, 15, 25, 50, 100])
  limit?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  order?: 'ASC' | 'DESC' | 'asc' | 'desc';
}
