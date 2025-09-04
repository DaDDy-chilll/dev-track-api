import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  DeviceService,
  CreateDeviceDto,
  UpdateDeviceDto,
} from './device.service';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  async createDevice(@Body() createDeviceDto: CreateDeviceDto) {
    return this.deviceService.createAllowedDevice(createDeviceDto);
  }

  @Get()
  async getAllDevices() {
    return this.deviceService.getAllowedDevices();
  }

  @Get('active')
  async getActiveDevices() {
    return this.deviceService.getActiveDevices();
  }

  @Put(':id')
  async updateDevice(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    return this.deviceService.updateDevice(id, updateDeviceDto);
  }

  @Put(':id/toggle')
  async toggleDeviceStatus(@Param('id', ParseIntPipe) id: number) {
    return this.deviceService.toggleDeviceStatus(id);
  }

  @Delete(':id')
  async deleteDevice(@Param('id', ParseIntPipe) id: number) {
    return this.deviceService.deleteDevice(id);
  }
}
