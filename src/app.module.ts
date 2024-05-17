import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@Auth';
import { AccountsModule } from '@accounts';
import { DatabaseModule } from './db/database.module';
import { ConfigModule } from '@nestjs/config/dist';
import { validationSchema } from './config/config.schema';
import { config } from './config';
import { JwtModule } from './jwt/jwt.module';
import { CommonModule } from './common/common.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    AuthModule,
    AccountsModule,
    DatabaseModule,
    JwtModule,
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }),
    MailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
