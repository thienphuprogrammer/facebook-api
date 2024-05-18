import { UsersEntity } from '@users';
import { IBlacklistedToken } from '../interface/blacklisted-token.interface';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'blacklisted_tokens' })
@Unique(['tokenId', 'users'])
export class BlacklistedTokenEntity implements IBlacklistedToken {
  @PrimaryGeneratedColumn('uuid')
  public tokenId: string;

  @PrimaryColumn()
  @ManyToOne(() => UsersEntity, (account) => account, {
    onDelete: 'CASCADE',
    // set primary key to be unique
  })
  public user: UsersEntity;

  //  @Property({ onCreate: () => new Date() })
  // convert to typeorm
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;
}
