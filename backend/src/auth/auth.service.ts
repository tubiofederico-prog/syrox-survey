import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private adminCredentials = {
    email: 'admin@syrox.com',
    password: 'admin123',
  };

  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string) {
    if (
      email !== this.adminCredentials.email ||
      password !== this.adminCredentials.password
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email, sub: 'admin' };
    const token = this.jwtService.sign(payload);

    return {
      token,
      message: 'Login successful',
    };
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
