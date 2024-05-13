import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { faker } from '@faker-js/faker';
import { AccountDetailEntity } from './account-detail.entity';
import { RoleEnum } from '@utils';

@Entity()
export class AccountsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'text',
  })
  password: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  role: RoleEnum;

  @OneToOne(() => AccountDetailEntity, {
    cascade: true,
    eager: true,
    nullable: true,
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  detail: AccountDetailEntity;

  static fakeOne(): AccountsEntity {
    const user = new AccountsEntity();
    user.email = faker.internet.email();
    user.password = faker.internet.password();
    user.role = RoleEnum.USER;
    user.detail = AccountDetailEntity.fakeOne(
      faker.helpers.arrayElement(['male', 'female'])
    );
    return user;
  }
}
