import { Module } from '@nestjs/common';

/**
 * Consent Management: grant / revoke / list scopes. Gates all data access.
 * OAuth2-ready seam: today platform-native consent records, later an
 * authorization-code grant without changing downstream consumers.
 */
@Module({})
export class ConsentModule {}
