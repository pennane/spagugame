import { TContext } from "../infrastructure/context";

export type TServiceHandler<IN, OUT> = (
  ctx: TContext,
  args: IN
) => Promise<OUT>;
