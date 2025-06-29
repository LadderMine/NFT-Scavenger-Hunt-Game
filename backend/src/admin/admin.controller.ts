import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './dto/login-admin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './roles.decorator';
import { AdminRole } from './admin-role.enum';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  async login(@Body() dto: LoginAdminDto) {
    const admin = await this.adminService.validateAdmin(dto.email, dto.password);
    if (!admin) {
      return { message: 'Invalid credentials' };
    }
    return this.adminService.login(admin);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.ADMIN)
  @ApiOperation({ summary: 'Get current admin profile' })
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('puzzles')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.ADMIN)
  @ApiOperation({ summary: 'Admin content management: puzzles (placeholder)' })
  getPuzzles() {
    return { message: 'Admin puzzles management placeholder' };
  }

  @Get('content')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.ADMIN)
  @ApiOperation({ summary: 'Admin content management: content (placeholder)' })
  getContent() {
    return { message: 'Admin content management placeholder' };
  }
}
