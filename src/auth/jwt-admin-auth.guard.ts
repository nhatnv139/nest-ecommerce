import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Observable} from 'rxjs';


@Injectable()
export class JwtAdminAuthGuard extends AuthGuard("jwt") {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    

    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException(`${info}`);
        }
        return user;
    }
}
