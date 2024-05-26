import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { OAuthProvidersEnum } from '../enums/oauth-providers.enum';
import { UsersEntity } from '@users';
import { IOAuthProvider } from '../interfaces/oauth-provider.interface';

@Entity({ name: 'oauth_provider' })
@Unique(['provider', 'user'])
export class OAuthProviderEntity implements IOAuthProvider {
  @PrimaryGeneratedColumn()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsEnum(OAuthProvidersEnum)
  public provider: OAuthProvidersEnum;

  @ManyToOne(() => UsersEntity)
  public user: UsersEntity;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public createdAt: Date = new Date();

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public updatedAt: Date = new Date();
}
