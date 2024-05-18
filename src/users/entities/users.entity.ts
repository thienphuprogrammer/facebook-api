import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { faker } from '@faker-js/faker';
import { RoleEnum } from '../../common/utils';
import { IUsers, IUserDetails } from '../interfaces';
import { CredentialsEmbeddable } from './credentials.entity';
import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { UserDetails } from './user-details.entity';

@Entity({ name: 'users' })
export class UsersEntity implements IUsers {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  @IsString()
  @IsEmail()
  public email: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  public username: string;

  @Column({
    type: 'text',
  })
  @IsString()
  public password: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  public role: RoleEnum;

  @OneToOne(() => UserDetails, {
    cascade: true,
    eager: true,
    nullable: true,
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  public detail: IUserDetails;

  @Column(() => CredentialsEmbeddable, {})
  public credentials: CredentialsEmbeddable = new CredentialsEmbeddable();

  @Column({
    type: 'boolean',
    default: false,
  })
  @IsBoolean()
  public confirmed: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;

  static fakeOne(): UsersEntity {
    const user = new UsersEntity();
    user.email = faker.internet.email();
    user.password = faker.internet.password();
    user.role = RoleEnum.USER;
    user.detail = UserDetails.fakeOne(
      faker.helpers.arrayElement(['male', 'female'])
    );
    user.confirmed = faker.datatype.boolean();
    user.createdAt = faker.date.recent();
    user.updatedAt = faker.date.recent();
    return user;
  }
}
