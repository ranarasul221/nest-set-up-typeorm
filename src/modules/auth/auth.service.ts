import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entiry/user.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: any) {
    const exists = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (exists) {
      throw new BadRequestException('User already exists');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = this.userRepo.create({
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      otp,
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      isEmailVerified: false,
    });

    await this.userRepo.save(user);

    return {
      message: 'OTP sent',
      otp,
    };
  }

async verifyOtp(dto: any) {
  const user = await this.userRepo.findOne({
    where: { email: dto.email },
  });

  if (!user) {
    throw new BadRequestException('User not found');
  }

  if (!user.otp || user.otp !== dto.otp) {
    throw new BadRequestException('Invalid OTP');
  }

  if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
    throw new BadRequestException('OTP expired');
  }

  user.isEmailVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;

  await this.userRepo.save(user);

  return {
    message: 'Verified',
  };
}
  async login(dto: any) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(dto.password, user.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email is not verified');
    }

    const accessToken = this.jwtService.sign({ sub: user.id });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );

    user.refreshToken = refreshToken;
    await this.userRepo.save(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshToken || user.refreshToken !== token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.jwtService.sign({ sub: user.id });

    return { accessToken };
  }
}