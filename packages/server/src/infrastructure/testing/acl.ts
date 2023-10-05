import { expect } from "chai";

import { TServiceHandler } from "../../services/models";
import { createMockContext } from "./mock";

export const testACL = async ({
  authenticatedService,
  service,
}: {
  authenticatedService: boolean;
  service: TServiceHandler<any, any>;
}) => {
  const { ctx: authenticatedContext } = await createMockContext({
    authenticated: true,
  });

  const { ctx: unauthenticatedContext } = await createMockContext({
    authenticated: false,
  });

  if (authenticatedService) {
    try {
      service(unauthenticatedContext, {});
    } catch (e: any) {
      expect(e.message).to.equal(
        "Tried to access service requiring higher access"
      );
    }
    try {
      service(authenticatedContext, {});
    } catch (e: any) {
      expect(e.message).to.not.equal(
        "Tried to access service requiring higher access"
      );
    }
  } else {
    try {
      service(unauthenticatedContext, {});
    } catch (e: any) {
      expect(e.message).to.not.equal(
        "Tried to access service requiring higher access"
      );
    }
    try {
      service(authenticatedContext, {});
    } catch (e: any) {
      expect(e.message).to.not.equal(
        "Tried to access service requiring higher access"
      );
    }
  }
};
