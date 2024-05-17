import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { CommonModule } from '../common/common.module';

@Module({
  providers: [JwtService],
  exports: [JwtService],
  imports: [CommonModule],
})
export class JwtModule {}
