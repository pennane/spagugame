import { EAuthScope } from "../infrastructure/context";
import { TServiceHandler } from "./services.models";

export const authenticatedService = <
  IN,
  OUT,
  T extends TServiceHandler<IN, OUT>
>(
  service: T
): T =>
  ((ctx, args) => {
    if (ctx.authScope === EAuthScope.UNAUTHENTICATED) {
      throw new Error(
        "Tried to access a services that requires higher authentication"
      );
    }
    return service(ctx, args);
  }) as T;
