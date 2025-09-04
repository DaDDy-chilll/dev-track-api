import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export interface CreateDeviceDto {
  ip_address?: string;
  mac_address?: string;
  device_name?: string;
  is_active?: boolean;
}

export interface UpdateDeviceDto {
  ip_address?: string;
  mac_address?: string;
  device_name?: string;
  is_active?: boolean;
}

@Injectable()
export class DeviceService {
  private prisma = new PrismaClient();

  async createAllowedDevice(data: CreateDeviceDto) {
    return this.prisma.t_allowed_device.create({
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
  }

  async getAllowedDevices() {
    return this.prisma.t_allowed_device.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async getActiveDevices() {
    return this.prisma.t_allowed_device.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateDevice(id: number, data: UpdateDeviceDto) {
    return this.prisma.t_allowed_device.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
  }

  async deleteDevice(id: number) {
    return this.prisma.t_allowed_device.delete({
      where: { id },
    });
  }

  async toggleDeviceStatus(id: number) {
    const device = await this.prisma.t_allowed_device.findUnique({
      where: { id },
    });

    if (!device) {
      throw new Error('Device not found');
    }

    return this.prisma.t_allowed_device.update({
      where: { id },
      data: {
        is_active: !device.is_active,
        updated_at: new Date(),
      },
    });
  }

  async isDeviceAllowed(
    ipAddress?: string,
    macAddress?: string,
  ): Promise<boolean> {
    if (ipAddress) {
      const deviceByIp = await this.prisma.t_allowed_device.findFirst({
        where: {
          ip_address: ipAddress,
          is_active: true,
        },
      });

      if (deviceByIp) return true;
    }

    if (macAddress) {
      const deviceByMac = await this.prisma.t_allowed_device.findFirst({
        where: {
          mac_address: macAddress,
          is_active: true,
        },
      });

      if (deviceByMac) return true;
    }

    return false;
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
