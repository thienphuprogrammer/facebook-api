import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum } from '../../utils/enums';
import { faker } from '@faker-js/faker';

@Entity()
export class AccountDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 256,
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
    length: 20,
    nullable: true,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  nickName: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  role: RoleEnum;

  static fakeOne(gender: 'male' | 'female') {
    const detail = new AccountDetail();
    detail.avatar = faker.image.avatar();
    detail.age = faker.number.int({ min: 18, max: 100 });
    detail.birthday = faker.date.past();
    detail.firstName = faker.person.firstName(gender);
    detail.lastName = faker.person.lastName(gender);
    detail.nickName = faker.internet.userName();
    detail.role = RoleEnum.USER;
    return detail;
  }
}
