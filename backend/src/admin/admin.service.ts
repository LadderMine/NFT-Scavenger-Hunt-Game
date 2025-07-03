import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminRole } from './admin-role.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  async createAdmin(dto: CreateAdminDto): Promise<Admin> {
    const hash = await bcrypt.hash(dto.password, 10);
    const admin = this.adminRepository.create({
      email: dto.email,
      password: hash,
      role: AdminRole.ADMIN,
    });
    return this.adminRepository.save(admin);
  }

  async findByEmail(email: string): Promise<Admin | undefined> {
    return this.adminRepository.findOne({ where: { email } });
  }

  async validateAdmin(email: string, password: string): Promise<Admin | null> {
    const admin = await this.findByEmail(email);
    if (!admin) return null;
    const isValid = await bcrypt.compare(password, admin.password);
    return isValid ? admin : null;
  }

  async login(admin: Admin) {
    const payload = { sub: admin.id, role: admin.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
