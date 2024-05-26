import {
  Collection,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { faker } from '@faker-js/faker';
import { RoleEnum } from '../../common/utils';
import { IUsers, IUserDetails } from '../interfaces';
import { CredentialsEmbeddable } from './credentials.entity';
import { IsBoolean, IsEmail, IsString, Length, Matches } from 'class-validator';
import { UserDetails } from './user-details.entity';
import { NAME_REGEX, SLUG_REGEX } from '../../common/consts/regex.const';
import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { OAuthProviderEntity } from './oauth-provider.entity';

@ObjectType('User')
@Directive(`@key(fields: "id")`)
@Entity({ name: 'users' })
export class UsersEntity implements IUsers {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field(() => String)
  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  @IsString()
  @IsEmail()
  public email: string;

  @Field(() => String)
  @Column({
    type: 'text',
    length: 60,
  })
  @IsString()
  @Matches(NAME_REGEX, {
    message: 'Name must not have special characters',
  })
  public name: string;

  @Field(() => String)
  @Column({
    type: 'varchar',
    length: 106,
    unique: true,
  })
  @Length(3, 106)
  @IsString()
  @Matches(SLUG_REGEX, {
    message: 'Username must be a valid slugs',
  })
  public username: string;

  @Field(() => String)
  @Column({
    type: 'text',
  })
  @IsString()
  public password: string;

  @Field()
  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  public role: RoleEnum;

  // @Field(() => UserDetails)
  // @Column(() => UserDetails, {})
  // @OneToOne(() => UserDetails, {
  //   cascade: true,
  //   eager: true,
  //   nullable: true,
  //   orphanedRowAction: 'delete',
  // })
  // @JoinColumn()
  // public detail: IUserDetails = new UserDetails();

  @Column(() => CredentialsEmbeddable, {})
  public credentials: CredentialsEmbeddable = new CredentialsEmbeddable();

  @Field(() => Boolean)
  @Column({
    type: 'boolean',
    default: false,
  })
  @IsBoolean()
  public confirmed: boolean;

  @Field(() => Date)
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @Field(() => Date)
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;

  @OneToMany(() => OAuthProviderEntity, (oauthProvider) => oauthProvider.user)
  public oauthProviders = new Collection<OAuthProviderEntity>();

  static fakeOne(): UsersEntity {
    const user = new UsersEntity();
    user.email = faker.internet.email();
    user.password = faker.internet.password();
    user.role = RoleEnum.USER;
    // user.detail = UserDetails.fakeOne(
    //   faker.helpers.arrayElement(['male', 'female'])
    // );
    user.confirmed = faker.datatype.boolean();
    user.createdAt = faker.date.recent();
    user.updatedAt = faker.date.recent();
    return user;
  }
}
