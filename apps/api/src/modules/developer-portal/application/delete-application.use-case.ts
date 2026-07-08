import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  APPLICATION_REPOSITORY,
  type ApplicationRepository,
} from '../domain/application-repository.port';

@Injectable()
export class DeleteApplicationUseCase {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applications: ApplicationRepository,
  ) {}

  async execute(ownerId: string, id: string): Promise<void> {
    const existing = await this.applications.findByIdForOwner(ownerId, id);
    if (!existing) {
      throw new NotFoundException('Application not found');
    }
    // Cascades to API keys and consents via Prisma onDelete rules.
    await this.applications.delete(id);
  }
}
