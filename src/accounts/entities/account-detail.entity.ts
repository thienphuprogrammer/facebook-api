import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { faker } from '@faker-js/faker';
import { IAccountDetail } from '../interfaces';

@Entity({ name: 'account_details' })
export class AccountDetail implements IAccountDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  avatar: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  age: number;

  @Column({
    type: 'date',
    nullable: true,
  })
  birthday: Date;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  nickName: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  number_phone: string;

  static fakeOne(gender: 'male' | 'female') {
    const detail = new AccountDetail();
    detail.avatar = faker.image.avatar();
    detail.age = faker.number.int({ min: 18, max: 100 });
    detail.birthday = faker.date.past();
    detail.firstName = faker.person.firstName(gender);
    detail.lastName = faker.person.lastName(gender);
    detail.nickName = faker.internet.userName();
    detail.number_phone = faker.phone.number();
    return detail;
  }
}
