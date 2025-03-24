import { Injectable } from "@nestjs/common"

@Injectable()
export class CacheService {
  private cache: Map<string, { value: any; expiry: number }> = new Map()

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    // Check if item has expired
    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key)
      return null
    }

    return item.value as T
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null
    this.cache.set(key, { value, expiry })
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key)
  }

  async clear(): Promise<void> {
    this.cache.clear()
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(pattern.replace("*", ".*"))
    return Array.from(this.cache.keys()).filter((key) => regex.test(key))
  }
}

