import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { faker } from '@faker-js/faker';
import { AccountDetail } from './account-detail.entity';

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
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  number_phone: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  password: string;

  @OneToOne(() => AccountDetail, {
    cascade: true,
    eager: true,
    nullable: false,
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  detail: AccountDetail;

  static fakeOne(): AccountsEntity {
    const user = new AccountsEntity();
    user.email = faker.internet.email();
    user.number_phone = faker.phone.number();
    user.password = faker.internet.password();
    user.detail = AccountDetail.fakeOne(
      faker.helpers.arrayElement(['male', 'female'])
    );
    return user;
  }
}
