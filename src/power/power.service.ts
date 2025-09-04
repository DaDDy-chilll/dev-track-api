import { Injectable } from '@nestjs/common';
import { PowerDto } from './dto/power.dto';

@Injectable()
export class PowerService {
  create(powerDto: PowerDto) {
    return powerDto;
  }

  // findAll() {
  //   return `This action returns all power`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} power`;
  // }

  // update(id: number, updatePowerDto: UpdatePowerDto) {
  //   return `This action updates a #${id} power`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} power`;
  // }
}
