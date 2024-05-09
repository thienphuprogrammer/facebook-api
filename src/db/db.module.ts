import { Module } from '@nestjs/common';
import { datasource } from './datasource';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(datasource.options)],
})
export class DbModule {}
