const db = require("../config/connection");
const { User, Creche, Ward, Exhibit } = require("../models");
const userSeeds = require("./userSeedsProd.json");
const crecheSeeds = require("./crecheSeedsProd.json");
const wardSeeds = require("./wardSeeds.json");

db.once("open", async () => {
  try {
    await Ward.create(wardSeeds);
    console.log("---Wards created---");
    await User.create(userSeeds);
    console.log("---Users created---");
    await Exhibit.create({ exhibitYear: 2023 });
    await Exhibit.create({ exhibitYear: 2022 });
    await Exhibit.create({ exhibitYear: 2021 });
    console.log("---Exhibits created---");
    for (let i = 0; i < crecheSeeds.length; i++) {
      const { _id, crecheUser, yearsDonated } = await Creche.create(
        crecheSeeds[i]
      );
      console.log(crecheUser);
      const [firstName, lastName] = crecheUser.split(" ");
      const user = await User.findOneAndUpdate(
        { firstName, lastName },
        {
          $addToSet: {
            creches: _id,
          },
        }
      );
      console.log(`User ${user.userName} has been updated with 1 creche.`);

      const exhibit = await Exhibit.findOneAndUpdate(
        { exhibitYear: yearsDonated },
        {
          $addToSet: {
            creches: _id,
          },
        }
      );
      console.log(`Creche added to the ${exhibit.exhibitYear} Exhibit.`);
    }
    console.log("---Creches created---");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("all done!");
  process.exit(0);
});
