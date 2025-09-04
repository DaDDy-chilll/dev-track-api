-- CreateTable
CREATE TABLE "public"."t_allowed_device" (
    "id" SERIAL NOT NULL,
    "ip_address" TEXT,
    "mac_address" TEXT,
    "device_name" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "t_allowed_device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "t_allowed_device_ip_address_key" ON "public"."t_allowed_device"("ip_address");

-- CreateIndex
CREATE UNIQUE INDEX "t_allowed_device_mac_address_key" ON "public"."t_allowed_device"("mac_address");

-- CreateIndex
CREATE INDEX "t_allowed_device_ip_address_idx" ON "public"."t_allowed_device"("ip_address");

-- CreateIndex
CREATE INDEX "t_allowed_device_mac_address_idx" ON "public"."t_allowed_device"("mac_address");
