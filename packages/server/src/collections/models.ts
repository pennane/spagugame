import {
  Collection,
  Db,
  IndexSpecification,
  Document,
  CreateIndexesOptions,
} from "mongodb";

export type CollectionGetter<T extends Document> = (db: Db) => Collection<T>;

export type IndexSpec = {
  specification: IndexSpecification;
  options: Omit<CreateIndexesOptions, "name"> & { name: string };
};

export type CollectionSettings<T extends Document> = {
  name: string;
  indexSpecs: IndexSpec[];
  collectionGetter: CollectionGetter<T>;
  seedDocuments?: T[];
};
