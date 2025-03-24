import { Injectable, Logger } from "@nestjs/common"
import type { HttpService } from "@nestjs/axios"
import type { ConfigService } from "@nestjs/config"
import { catchError, firstValueFrom, map, of } from "rxjs"

interface GeoLocationResponse {
  country: string
  region: string
  city: string
  latitude: number
  longitude: number
}

@Injectable()
export class GeoLocationService {
  private readonly logger = new Logger(GeoLocationService.name)
  private readonly apiKey: string
  private readonly cache: Map<string, GeoLocationResponse> = new Map()
  private readonly cacheTtl: number = 24 * 60 * 60 * 1000 // 24 hours

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>("GEOLOCATION_API_KEY", "")
  }

  async getLocationFromIp(ipAddress: string): Promise<string | null> {
    if (!ipAddress || ipAddress === "127.0.0.1" || ipAddress === "::1") {
      return "localhost"
    }

    // Check cache first
    const cachedLocation = this.cache.get(ipAddress)
    if (cachedLocation) {
      return this.formatLocation(cachedLocation)
    }

    if (!this.apiKey) {
      this.logger.warn("No GeoLocation API key provided")
      return null
    }

    try {
      const response = await firstValueFrom(
        this.httpService
          .get<GeoLocationResponse>(`https://api.ipgeolocation.io/ipgeo?apiKey=${this.apiKey}&ip=${ipAddress}`)
          .pipe(
            map((response) => response.data),
            catchError((error) => {
              this.logger.error(`Error fetching geolocation data: ${error.message}`)
              return of(null)
            }),
          ),
      )

      if (response) {
        // Cache the result
        this.cache.set(ipAddress, response)

        // Set cache expiration
        setTimeout(() => {
          this.cache.delete(ipAddress)
        }, this.cacheTtl)

        return this.formatLocation(response)
      }
    } catch (error) {
      this.logger.error(`Failed to get location for IP ${ipAddress}: ${error.message}`)
    }

    return null
  }

  private formatLocation(location: GeoLocationResponse): string {
    return `${location.city}, ${location.region}, ${location.country}`
  }
}

