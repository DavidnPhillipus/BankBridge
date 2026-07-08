import {
  BadRequestException,
  createParamDecorator,
  type ExecutionContext,
} from '@nestjs/common';

export const CUSTOMER_ID_HEADER = 'x-customer-id';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Reads X-Customer-Id — the end-user whose consented data is being accessed. */
export const CustomerId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<{ headers: Record<string, string> }>();
    const raw = request.headers[CUSTOMER_ID_HEADER];
    if (!raw || !UUID_RE.test(raw)) {
      throw new BadRequestException(`Missing or invalid ${CUSTOMER_ID_HEADER} header`);
    }
    return raw;
  },
);
