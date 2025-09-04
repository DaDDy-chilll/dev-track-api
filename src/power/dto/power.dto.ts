import { IsString } from 'class-validator';

export class PowerDto {
  @IsString()
  macAddress: string;
}
