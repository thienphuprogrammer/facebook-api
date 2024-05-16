import { ICredentials } from '../interfaces/credentials.interface';
import { Column, Entity } from 'typeorm';

@Entity()
export class CredentialsEmbeddable implements ICredentials {
  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  lastPassword: string;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  passwordUpdatedAt: number = Date.now();

  @Column({
    type: 'bigint',
    nullable: false,
  })
  updatedAt: number = Date.now();

  @Column({
    type: 'int',
    nullable: false,
  })
  version: number = 0;

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
