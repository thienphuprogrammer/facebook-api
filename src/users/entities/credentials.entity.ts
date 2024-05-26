import { ICredentials } from '../interfaces';
import { Column, Entity } from 'typeorm';
import dayjs from 'dayjs';

//Embeddable() convert to typeorm
@Entity({ name: 'credentials' })
export class CredentialsEmbeddable implements ICredentials {
  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    default: '',
  })
  public lastPassword: string;

  @Column({
    type: 'bigint',
    nullable: false,
    default: dayjs().unix(),
  })
  public passwordUpdatedAt: number = dayjs().unix();

  @Column({
    type: 'bigint',
    nullable: false,
    default: dayjs().unix(),
  })
  public updatedAt: number = dayjs().unix();

  @Column({
    type: 'int',
    nullable: false,
    default: 0,
  })
  public version: number = 0;

  constructor(isConfirmed = false) {
    this.version = isConfirmed ? 1 : 0;
  }

  public updatePassword(password: string): void {
    this.version++;
    this.lastPassword = password;
    const now = Date.now();
    this.passwordUpdatedAt = now;
    this.updatedAt = now;
  }

  public updateVersion(): void {
    this.version++;
    this.updatedAt = Date.now();
  }
}
