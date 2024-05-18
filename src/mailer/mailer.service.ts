import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IEmailConfig } from '../jwt/interfaces';
import { ITemplatedData } from './interface/template-data.interface';
import { readFileSync } from 'fs';
import { ITemplates } from './interface/templates.interface';
import { IUsers } from '../users/interfaces';
import Handlebars from 'handlebars';

@Injectable()
export class MailerService {
  private readonly loggerService: LoggerService;
  private readonly transport: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly email: string;
  private readonly domain: string;
  private readonly templates: ITemplates;

  constructor(private readonly configService: ConfigService) {
    const emailConfig = this.configService.get<IEmailConfig>('emailService');
    this.transport = createTransport(emailConfig);
    this.email = `"My App" <${emailConfig.auth.user}>`;
    this.domain = this.configService.get<string>('domain');
    this.loggerService = new Logger(MailerService.name);
    this.templates = {
      confirmation: MailerService.parseTemplate('confirmation'),
      resetPassword: MailerService.parseTemplate('reset-password'),
    };
  }

  private static parseTemplate(
    templateName: string
  ): Handlebars.TemplateDelegate<ITemplatedData> {
    const templateText = readFileSync(
      [__dirname, 'templates', `${templateName}.hbs`].join('/'),
      'utf8'
    );
    return Handlebars.compile<ITemplatedData>(templateText);
  }

  public sendEmail(
    to: string,
    subject: string,
    html: string,
    log?: string
  ): void {
    this.transport
      .sendMail({
        from: this.email,
        to,
        subject,
        html,
      })
      .then((r) => this.loggerService.log(log || `Email sent: ${r.messageId}`))
      .catch((e) => this.loggerService.error(`Email error: ${e.message}`));
  }

  public sendConfirmationEmail(account: IUsers, token: string): void {
    const { email } = account;
    const subject = 'Confirm your email';
    const html = this.templates.confirmation({
      name: email,
      link: `https://${this.domain}/auth/confirm/${token}`,
    });
    this.sendEmail(email, subject, html, 'Confirmation email sent');
  }

  public sendResetPasswordEmail(account: IUsers, token: string): void {
    const { email } = account;
    const subject = 'Reset your password';
    const html = this.templates.resetPassword({
      name: email,
      link: `https://${this.domain}/auth/reset/${token}`,
    });
    this.sendEmail(email, subject, html, 'Reset password email sent');
  }
}
