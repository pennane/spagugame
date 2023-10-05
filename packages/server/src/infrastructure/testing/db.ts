import { Collection } from "mongodb";
import { CONFIG_OBJECT } from "../config";
import { getGlobalContext } from "../context";

export const clearDatabase = async () => {
  if (CONFIG_OBJECT.NODE_ENV !== "test") {
    throw new Error("clearDatabase should only be used in test environment");
  }

  const { db, collectionSettings } = await getGlobalContext();
  // get the name of db
  const dbName = db.databaseName;
  if (dbName !== CONFIG_OBJECT.MONGO_TEST_DB_NAME) {
    throw new Error(
      `clearDatabase should only be used with ${CONFIG_OBJECT.MONGO_TEST_DB_NAME} database`
    );
  }

  await db.dropDatabase();

  for (const settings of Object.values(collectionSettings)) {
    const collection = settings.collectionGetter(db);
    const seedDocuments = settings.seedDocuments;
    if (!seedDocuments || seedDocuments.length === 0) continue;

    for (const seedDocument of settings.seedDocuments || []) {
      await (collection as Collection<any>).findOneAndUpdate(
        { _id: seedDocument._id },
        {
          $set: { ...seedDocument },
        },
        { upsert: true }
      );
    }
  }
};
