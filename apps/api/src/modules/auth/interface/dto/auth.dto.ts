import { createZodDto } from 'nestjs-zod';
import { loginSchema, refreshSchema, registerSchema } from '@bankbridge/contracts';

// Zod-backed DTOs: validation rules live in @bankbridge/contracts and are shared
// with the web app, and Swagger schemas are generated from the same source.
export class RegisterDto extends createZodDto(registerSchema) {}
export class LoginDto extends createZodDto(loginSchema) {}
export class RefreshDto extends createZodDto(refreshSchema) {}
