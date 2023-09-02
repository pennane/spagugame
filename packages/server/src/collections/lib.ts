import {
  Collection,
  DeleteResult,
  Filter,
  FindOptions,
  InsertOneResult,
  UpdateResult,
} from "mongodb";
import { TContext } from "../infrastructure/context";

type ExtractCollectionSchema<T> = T extends Collection<infer X> ? X : never;

export const find = async <T extends keyof TContext["collections"]>(
  ctx: TContext,
  collection: T,
  {
    filter,
    options,
  }: {
    filter: Filter<ExtractCollectionSchema<TContext["collections"][T]>>;
    options?: FindOptions;
  }
): Promise<ExtractCollectionSchema<TContext["collections"][T]>[]> => {
  const documents = await ctx.collections[collection]
    .find(filter as any, options)
    .toArray();
  return documents as any as ExtractCollectionSchema<
    TContext["collections"][T]
  >[];
};

export const get = async <T extends keyof TContext["collections"]>(
  ctx: TContext,
  collection: T,
  {
    filter,
  }: {
    filter: Filter<ExtractCollectionSchema<TContext["collections"][T]>>;
  }
): Promise<ExtractCollectionSchema<TContext["collections"][T]> | null> => {
  const document = await ctx.collections[collection].findOne(filter as any);
  return document as ExtractCollectionSchema<TContext["collections"][T]>;
};

export const create = async <T extends keyof TContext["collections"]>(
  ctx: TContext,
  collection: T,
  data: ExtractCollectionSchema<TContext["collections"][T]>
): Promise<InsertOneResult<any>> => {
  const result = await ctx.collections[collection].insertOne(data as any);
  return result;
};

export const remove = async <T extends keyof TContext["collections"]>(
  ctx: TContext,
  collection: T,
  {
    filter,
  }: {
    filter: Filter<ExtractCollectionSchema<TContext["collections"][T]>>;
  }
): Promise<DeleteResult> => {
  const result = await ctx.collections[collection].deleteOne(filter as any);
  return result;
};

export const update = async <T extends keyof TContext["collections"]>(
  ctx: TContext,
  collection: T,
  {
    filter,
    update,
  }: {
    filter: Filter<ExtractCollectionSchema<TContext["collections"][T]>>;
    update: Partial<ExtractCollectionSchema<TContext["collections"][T]>>;
  }
): Promise<
  UpdateResult<ExtractCollectionSchema<TContext["collections"][T]>>
> => {
  const result = await ctx.collections[collection].updateOne(filter as any, {
    $set: update as any,
  });
  return result as UpdateResult<
    ExtractCollectionSchema<TContext["collections"][T]>
  >;
};
