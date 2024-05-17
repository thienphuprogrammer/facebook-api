import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { faker } from '@faker-js/faker';
import { RoleEnum } from '../../common/utils';
import { IAccounts, IAccountDetail, ICredentials } from '../interfaces';
import { CredentialsEmbeddable } from './credentials.entity';
import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { AccountDetail } from './account-detail.entity';

@Entity({ name: 'accounts' })
export class AccountsEntity implements IAccounts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @Column({
    type: 'text',
  })
  @IsString()
  password: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  role: RoleEnum;

  @OneToOne(() => AccountDetail, {
    cascade: true,
    eager: true,
    nullable: true,
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  detail: IAccountDetail;

  @OneToOne(() => CredentialsEmbeddable, {
    cascade: true,
    eager: true,
    nullable: false,
    orphanedRowAction: 'delete',
  })
  credentials: ICredentials;

  @Column({
    type: 'boolean',
    default: false,
  })
  @IsBoolean()
  confirmed: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  static fakeOne(): AccountsEntity {
    const user = new AccountsEntity();
    user.email = faker.internet.email();
    user.password = faker.internet.password();
    user.role = RoleEnum.USER;
    user.detail = AccountDetail.fakeOne(
      faker.helpers.arrayElement(['male', 'female'])
    );
    user.confirmed = faker.datatype.boolean();
    user.createdAt = faker.date.recent();
    user.updatedAt = faker.date.recent();
    return user;
  }
}
