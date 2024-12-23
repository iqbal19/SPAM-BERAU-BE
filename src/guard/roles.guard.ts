import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>(ROLES_KEY, context.getHandler());
    if (!requiredRole) {
      return true; // Jika tidak ada role yang ditentukan, akses diizinkan
    }

    const { user } = context.switchToHttp().getRequest();
    return user?.role === requiredRole; // Periksa jika role pengguna cocok
  }
}