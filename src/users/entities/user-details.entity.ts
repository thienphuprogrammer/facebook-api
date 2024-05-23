import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { faker } from '@faker-js/faker';
import { IUserDetails } from '../interfaces';

@Entity({ name: 'account_details' })
export class UserDetails implements IUserDetails {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  public avatar: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  public age: number;

  @Column({
    type: 'date',
    nullable: true,
  })
  public birthday: Date;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  public firstName: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  public lastName: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  public nickName: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  public number_phone: string;

  static fakeOne(gender: 'male' | 'female') {
    const detail = new UserDetails();
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
