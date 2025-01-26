import { registerAs } from '@nestjs/config'

export default registerAs('appConfig', () => ({
    enviromemt: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION
}))