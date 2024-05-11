import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@Auth';
import { AccountsModule } from '@accounts';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [AuthModule, AccountsModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
