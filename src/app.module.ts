import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
@Module({
  imports: [AuthModule, AccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
