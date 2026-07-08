import type { AppEnvironment } from '@bankbridge/contracts';
import type { Application } from './application.entity';

export const APPLICATION_REPOSITORY = Symbol('APPLICATION_REPOSITORY');

export interface CreateApplicationData {
  ownerId: string;
  name: string;
  description?: string;
  environment: AppEnvironment;
  redirectUris: string[];
}

export interface UpdateApplicationData {
  name?: string;
  description?: string | null;
  redirectUris?: string[];
  isActive?: boolean;
}

export interface ApplicationRepository {
  create(data: CreateApplicationData): Promise<Application>;
  findByOwner(ownerId: string): Promise<Application[]>;
  findAllActive(): Promise<Application[]>;
  findById(id: string): Promise<Application | null>;
  findByIdForOwner(ownerId: string, id: string): Promise<Application | null>;
  update(id: string, data: UpdateApplicationData): Promise<Application>;
  delete(id: string): Promise<void>;
}
