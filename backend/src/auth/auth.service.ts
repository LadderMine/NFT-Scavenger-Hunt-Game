/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

export interface LoginDto {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto, session: any) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Store user data in session
    session.userId = user.id;
    session.username = user.username;
    session.isAuthenticated = true;

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async logout(session: any) {
    return new Promise((resolve, reject) => {
      session.destroy((err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Logout successful' });
        }
      });
    });
  }

  getSessionInfo(session: any) {
    if (!session.isAuthenticated) {
      throw new UnauthorizedException('Not authenticated');
    }

    return {
      isAuthenticated: true,
      user: {
        id: session.userId,
        username: session.username,
      },
      sessionId: session.id,
    };
  }
}
