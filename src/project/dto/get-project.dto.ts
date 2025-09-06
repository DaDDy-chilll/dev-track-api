import { IsOptional, IsString } from 'class-validator';

export class GetProjectDto {
  @IsString()
  @IsOptional()
  start_date: string;

  @IsString()
  @IsOptional()
  end_date: string;
}
