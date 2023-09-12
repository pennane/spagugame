import { IUser } from "../collections/User/User";
import { UserRole } from "../graphql/generated/graphql";
import { TContext } from "../infrastructure/context";
import { TServiceHandler } from "./models";

type TContextWithRequiredUser = Omit<TContext, "user"> & { user: IUser };

export const authenticatedService = <IN, OUT>(
  service: TServiceHandler<IN, OUT, TContextWithRequiredUser>
): TServiceHandler<IN, OUT> =>
  ((ctx, args) => {
    if (!ctx.user) {
      throw new Error(
        "Tried to access a services that requires higher authentication"
      );
    }
    return service(ctx as TContextWithRequiredUser, args);
  }) as TServiceHandler<IN, OUT>;

export const adminAuthenticatedService = <IN, OUT>(
  service: TServiceHandler<IN, OUT, TContextWithRequiredUser>
): TServiceHandler<IN, OUT> =>
  ((ctx, args) => {
    if (
      !ctx.user?.roles ||
      !ctx.user.roles.some((role) => role === UserRole.Admin)
    ) {
      throw new Error(
        "Tried to access a services that requires higher authentication"
      );
    }
    return service(ctx as TContextWithRequiredUser, args);
  }) as TServiceHandler<IN, OUT>;
