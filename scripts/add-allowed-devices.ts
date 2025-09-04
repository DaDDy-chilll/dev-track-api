import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addAllowedDevices() {
  try {
    // Sample devices - replace with your actual IP addresses and MAC addresses
    const devices = [
      {
        ip_address: '192.168.100.218',
        mac_address: 'b4:2e:99:ec:05:aa',
        device_name: 'dev-track-desktop',
        is_active: true,
      },
      {
        ip_address: '192.168.0.135',
        mac_address: '7c:c2:c6:16:d3:b5',
        device_name: 'dev-track-desktop',
        is_active: true,
      },
    ];

    for (const device of devices) {
      const created = await prisma.t_allowed_device.create({
        data: device,
      });
      console.log(`Added device: ${created.device_name} (ID: ${created.id})`);
    }

    console.log('✅ All devices added successfully!');
  } catch (error) {
    console.error('❌ Error adding devices:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addAllowedDevices();
