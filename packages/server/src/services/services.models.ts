import { TGlobalContext } from "../infrastructure/context";

export type TServiceHandler<IN, OUT> = (
  ctx: TGlobalContext,
  args: IN
) => Promise<OUT>;
