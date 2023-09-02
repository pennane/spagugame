import { Collection } from "mongodb";
import { initializeMongo } from "../infrastructure/mongo";

initializeMongo().then(async ({ collectionSettings, db }) => {
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
  console.log("Done");
  process.exit(0);
});
