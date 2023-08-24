import { EAuthScope } from "../infrastructure/context";
import { TServiceHandler } from "./services.models";

export const authenticatedService = <T extends TServiceHandler<any, any>>(
  service: T
) =>
  ((ctx, args) => {
    if (ctx.authScope === EAuthScope.UNAUTHENTICATED) {
      throw new Error(
        "Tried to access a services that requires higher authentication"
      );
    }
    return service(ctx, args);
  }) as T;
