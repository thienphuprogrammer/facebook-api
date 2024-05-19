import { AccountsEntity } from 'src/accounts/entities/accounts.entity';
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
@Unique(['tokenId', 'accounts'])
export class BlacklistedTokenEntity implements IBlacklistedToken {
  @PrimaryGeneratedColumn('uuid')
  public tokenId: string;

  @PrimaryColumn()
  @ManyToOne(() => AccountsEntity, (account) => account, {
    onDelete: 'CASCADE',
    // set primary key to be unique
  })
  public user: AccountsEntity;

  //  @Property({ onCreate: () => new Date() })
  // convert to typeorm
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;
}
