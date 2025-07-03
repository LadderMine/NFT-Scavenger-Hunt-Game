import { Injectable } from '@nestjs/common';

export interface LeaderboardUser {
  userId: string;
  username: string;
  points: number;
  puzzlesSolved: number;
}

export interface LeaderboardEntry extends LeaderboardUser {
  rank: number;
}

@Injectable()
export class LeaderboardService {
  private users: LeaderboardUser[] = [];
  private leaderboardCache: LeaderboardEntry[] = [];
  private cacheTimestamp: number = 0;
  private readonly CACHE_TTL = 60 * 1000; // 1 minute
  private readonly TOP_N = 100;

  // For demonstration, add or update a user's score
  upsertUser(user: LeaderboardUser) {
    const idx = this.users.findIndex(u => u.userId === user.userId);
    if (idx !== -1) {
      this.users[idx] = user;
    } else {
      this.users.push(user);
    }
    this.invalidateCache();
  }

  // Aggregate, sort, and rank users
  private computeLeaderboard(): LeaderboardEntry[] {
    const sorted = [...this.users].sort((a, b) => {
      // Sort by points, then puzzlesSolved, then username
      if (b.points !== a.points) return b.points - a.points;
      if (b.puzzlesSolved !== a.puzzlesSolved) return b.puzzlesSolved - a.puzzlesSolved;
      return a.username.localeCompare(b.username);
    });
    return sorted.slice(0, this.TOP_N).map((user, i) => ({ ...user, rank: i + 1 }));
  }

  // Get leaderboard with caching
  getLeaderboard(page = 1, pageSize = 10): { entries: LeaderboardEntry[]; total: number } {
    const now = Date.now();
    if (!this.leaderboardCache.length || now - this.cacheTimestamp > this.CACHE_TTL) {
      this.leaderboardCache = this.computeLeaderboard();
      this.cacheTimestamp = now;
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      entries: this.leaderboardCache.slice(start, end),
      total: this.leaderboardCache.length,
    };
  }

  // Invalidate cache when data changes
  private invalidateCache() {
    this.leaderboardCache = [];
    this.cacheTimestamp = 0;
  }
} 