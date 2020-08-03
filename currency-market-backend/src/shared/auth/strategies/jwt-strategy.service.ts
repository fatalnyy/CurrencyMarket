import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { Configuration } from '../../configuration/configuration.enum';
import { ConfigurationService } from '../../configuration/configuration.service';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../jwt-payload';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy) {
  constructor(
    private readonly _authService: AuthService,
    private readonly _configurationService: ConfigurationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configurationService.get(Configuration.JWT_KEY),
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback) {
    const user = await this._authService.validatePayload(payload);
    if (!user) {
      return done(new HttpException({}, HttpStatus.UNAUTHORIZED), false);
    }

    return done(null, user, payload.iat);
  }
}
