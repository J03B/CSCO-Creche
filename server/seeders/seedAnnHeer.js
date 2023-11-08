const db = require("../config/connection");
const { User, Creche, Exhibit } = require("../models");
const crecheSeeds = require("./seedAnnHeerCreches.json");

db.once("open", async () => {
  try {
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
