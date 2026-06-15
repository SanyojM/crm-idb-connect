import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './require-permissions.decorator';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required || required.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    // Super Admin or Head Office Admin bypass — mirrors getScope bypass exactly
    const role = (user.role || '').toLowerCase().trim();
    const branchType = (user.branch_type || '').toLowerCase().trim();
    const isSuper = role.includes('super');
    const isHeadOfficeAdmin = branchType === 'headoffice' && (role === 'admin' || isSuper);
    if (isSuper || isHeadOfficeAdmin) return true;

    // Agents/B2B bypass — they have their own scope, not permission-table driven
    if (user.type === 'agent' || user.type === 'agent_team_member') return true;

    const partnerId: string | undefined = user.id || user.userId;
    if (!partnerId) return false;

    let effective: string[] = [];
    try {
      effective = await this.permissionsService.getEffectivePermissionsForPartner(partnerId);
    } catch (err) {
      this.logger.error(`Failed to resolve permissions for partner ${partnerId}: ${err?.message}`);
      // Fail open in report mode, fail closed in enforce mode
      if (process.env.ENFORCE_LEAD_PERMISSIONS !== 'true') return true;
      return false;
    }

    const granted = required.some((r) => effective.includes(r));

    if (!granted) {
      if (process.env.ENFORCE_LEAD_PERMISSIONS !== 'true') {
        this.logger.warn(
          `[AUTHZ would-deny] partner=${partnerId} needs[${required.join(',')}] has[${effective.join(',')}] path=${request.url}`,
        );
        return true; // report mode: log but don't block
      }
      throw new ForbiddenException(
        `Access denied. Required permission(s): ${required.join(', ')}`,
      );
    }

    return true;
  }
}
