import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// gaelmousset@orange.fr / Poulailler2000

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ token: string; email: string }> {
    const exists = await this.usersService.findByEmail(dto.email);
    if (exists) throw new ConflictException('Cet email est déjà utilisé');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({ email: dto.email, passwordHash });
    const token = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
    });
    return { token, email: user.email };
  }

  async login(dto: LoginDto): Promise<{ token: string; email: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Identifiants incorrects');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Identifiants incorrects');
    const token = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
    });
    return { token, email: user.email };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    // Ne pas révéler si l'email existe ou non
    if (!user) return { message: 'Si cet email existe, un lien a été envoyé.' };
    const resetToken = randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3_600_000); // 1h
    await this.usersService.setResetToken(user._id as any, resetToken, expiry);
    // TODO: send email with reset link containing resetToken
    console.log(`[DEV] Reset token for ${email}: ${resetToken}`);
    return { message: 'Si cet email existe, un lien a été envoyé.' };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findByResetToken(token);
    if (!user) throw new BadRequestException('Token invalide ou expiré');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user._id as any, passwordHash);
  }
}
