import { SetMetadata } from "@nestjs/common"

export const MAINTENANCE_EXEMPT_KEY = "maintenanceExempt"
export const MaintenanceExempt = () => SetMetadata(MAINTENANCE_EXEMPT_KEY, true)
