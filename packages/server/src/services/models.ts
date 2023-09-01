import { TContext } from "../infrastructure/context";

export type TServiceHandler<IN, OUT, CTX extends TContext = TContext> = (
  ctx: CTX,
  args: IN
) => Promise<OUT>;
