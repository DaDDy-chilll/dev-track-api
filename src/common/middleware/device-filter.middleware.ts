import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DeviceFilterMiddleware implements NestMiddleware {
  private prisma = new PrismaClient();

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Get client IP address
      const clientIp = this.getClientIp(req);

      // Get MAC address from headers (if provided by client)
      const macAddress = req.headers['x-mac-address'] as string;

      // Check if IP or MAC address is allowed
      const isAllowed = await this.checkDeviceAccess(clientIp, macAddress);

      if (!isAllowed) {
        throw new ForbiddenException('Access denied: Device not authorized');
      }

      next();
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      // Log error and deny access for any database or other errors
      console.error('Device filter middleware error:', error);
      throw new ForbiddenException('Access denied: Unable to verify device');
    }
  }

  private getClientIp(req: Request): string {
    // Check various headers for the real IP address
    const forwarded = req.headers['x-forwarded-for'] as string;
    const realIp = req.headers['x-real-ip'] as string;
    const cfConnectingIp = req.headers['cf-connecting-ip'] as string;

    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }

    if (realIp) {
      return realIp;
    }

    if (cfConnectingIp) {
      return cfConnectingIp;
    }

    return (
      req.connection.remoteAddress || req.socket.remoteAddress || 'unknown'
    );
  }

  private async checkDeviceAccess(
    ipAddress: string,
    macAddress?: string,
  ): Promise<boolean> {
    try {
      // Check if device exists and is active by IP address
      if (ipAddress && ipAddress !== 'unknown') {
        const deviceByIp = await this.prisma.t_allowed_device.findFirst({
          where: {
            ip_address: ipAddress,
            is_active: true,
          },
        });

        if (deviceByIp) {
          return true;
        }
      }

      // Check if device exists and is active by MAC address
      if (macAddress) {
        const deviceByMac = await this.prisma.t_allowed_device.findFirst({
          where: {
            mac_address: macAddress,
            is_active: true,
          },
        });

        if (deviceByMac) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Database error in device access check:', error);
      return false;
    }
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
