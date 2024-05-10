import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class AuthService {
  constructor(
    private AccountsService: AccountsService,
    private jwtService: JwtService
  ) {}

  async logIn() {}

  async loginWithGoogle() {}
}
