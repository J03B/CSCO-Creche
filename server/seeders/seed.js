const db = require('../config/connection');
const { User, Creche, Ward, Exhibit } = require('../models');
const userSeeds = require('./userSeeds.json');
const crecheSeeds = require('./crecheSeeds.json');
const wardSeeds = require('./wardSeeds.json');

db.once('open', async () => {
  try {
    await Creche.deleteMany({});
    await User.deleteMany({});
    await Ward.deleteMany({});
    console.log("---Creches, users, and wards deleted---");

    await Ward.create(wardSeeds);
    console.log("---Wards created---");
    await User.create(userSeeds);
    console.log("---Users created---");
    await Exhibit.create({exhibitYear: 2023});
    await Exhibit.create({exhibitYear: 2022});
    await Exhibit.create({exhibitYear: 2021});
    console.log("---Exhibits created---");

    for (let i = 0; i < crecheSeeds.length; i++) {
      const { _id, crecheUser, yearsDonated } = await Creche.create(crecheSeeds[i]);
      console.log(crecheUser);
      const [ firstName, lastName ] = crecheUser.split(" ");
      const user = await User.findOneAndUpdate(
        { firstName, lastName },
        {
          $addToSet: {
            creches: _id,
          },
        }
      );
      console.log(`User ${user.userName} has been updated with 1 creche.`)

      const exhibit = await Exhibit.findOneAndUpdate(
        {exhibitYear: yearsDonated},
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

  console.log('all done!');
  process.exit(0);
});
