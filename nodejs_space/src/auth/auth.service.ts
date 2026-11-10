import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ACHIEVEMENT_KEYS } from '../constants/game.constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const hash = await bcryptjs.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.playerName,
        playerName: dto.playerName,
        avatarEmoji: dto.avatarEmoji ?? '😎',
        gameState: {
          create: {
            cash: 50,
            bossCoins: 50,
            level: 1,
            xp: 0,
            totalBossCoinsEarned: 50,
            weekStartNetWorth: 50,
            weekStartDate: this.getMondayOfCurrentWeek(),
          },
        },
        achievements: {
          create: ACHIEVEMENT_KEYS.map((key) => ({ achievementKey: key })),
        },
      },
    });

    const token = this.generateToken(user.id, user.email);
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name, playerName: user.playerName, avatarEmoji: user.avatarEmoji },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcryptjs.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.generateToken(user.id, user.email);
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name, playerName: user.playerName, avatarEmoji: user.avatarEmoji },
    };
  }

  async me(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return {
      user: { id: user.id, email: user.email, name: user.name, playerName: user.playerName, avatarEmoji: user.avatarEmoji, createdAt: user.createdAt.toISOString() },
    };
  }

  private generateToken(userId: number, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }

  private getMondayOfCurrentWeek(): Date {
    const now = new Date();
    const day = now.getUTCDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setUTCDate(now.getUTCDate() + diff);
    monday.setUTCHours(0, 0, 0, 0);
    return monday;
  }
}
