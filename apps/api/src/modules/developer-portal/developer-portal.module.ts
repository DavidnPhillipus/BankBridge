import { Module } from '@nestjs/common';
import { ListPublicApplicationsUseCase } from './application/list-public-applications.use-case';
import { CreateApplicationUseCase } from './application/create-application.use-case';
import { DeleteApplicationUseCase } from './application/delete-application.use-case';
import { GetApplicationUseCase } from './application/get-application.use-case';
import { ListApplicationsUseCase } from './application/list-applications.use-case';
import { UpdateApplicationUseCase } from './application/update-application.use-case';
import { APPLICATION_REPOSITORY } from './domain/application-repository.port';
import { PrismaApplicationRepository } from './infrastructure/prisma-application.repository';
import { PublicApplicationsController } from './interface/public-applications.controller';
import { ApplicationsController } from './interface/applications.controller';

/**
 * Developer Portal: lets DEVELOPER/ADMIN users register and manage the
 * applications that consume the public API. Exports APPLICATION_REPOSITORY so
 * the API Keys module can verify application ownership.
 */
@Module({
  controllers: [ApplicationsController, PublicApplicationsController],
  providers: [
    CreateApplicationUseCase,
    ListPublicApplicationsUseCase,
    ListApplicationsUseCase,
    GetApplicationUseCase,
    UpdateApplicationUseCase,
    DeleteApplicationUseCase,
    { provide: APPLICATION_REPOSITORY, useClass: PrismaApplicationRepository },
  ],
  exports: [APPLICATION_REPOSITORY],
})
export class DeveloperPortalModule {}
