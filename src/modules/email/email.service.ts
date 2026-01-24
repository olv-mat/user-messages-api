import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { UserEntity } from '../user/entities/user.entity';

/* 
  npm i nodemailer
  npm i --D @types/nodemailer
*/

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.getOrThrow('EMAIL_HOST'),
      port: configService.getOrThrow('EMAIL_PORT'),
      secure: false,
      auth: {
        user: configService.getOrThrow('EMAIL_USER'),
        pass: configService.getOrThrow('EMAIL_PASSWORD'),
      },
    });
  }

  public async sendWelcomeMessage(userEntity: UserEntity): Promise<void> {
    const subject = 'Welcome! Account Created Successfully';
    const content =
      `Hello, ${userEntity.name}! Welcome to our platform. Your account has been successfully created.
      We are excited to have you with us! You can now log in and start exploring our features.`.trim();
    await this.sendEmail(userEntity.email, subject, content);
  }

  private async sendEmail(
    to: string,
    subject: string,
    content: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"No Reply" <${this.configService.getOrThrow('EMAIL_FROM')}>`,
      to: to,
      subject: subject,
      text: content,
    });
  }
}
