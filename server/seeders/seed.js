const db = require('../config/connection');
const { User, Creche, Ward } = require('../models');
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

    for (let i = 0; i < crecheSeeds.length; i++) {
      const { _id, crecheUser } = await Creche.create(crecheSeeds[i]);
      const user = await User.findOneAndUpdate(
        { userName: crecheUser },
        {
          $addToSet: {
            creches: _id,
          },
        }
      );
      console.log(`User ${user.userName} has been updated with 1 creche.`)
    }
    console.log("---Creches created---");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('all done!');
  process.exit(0);
});
