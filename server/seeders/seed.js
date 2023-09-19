const db = require('../config/connection');
const { User, Creche } = require('../models');
const userSeeds = require('./userSeeds.json');
const crecheSeeds = require('./crecheSeeds.json');

db.once('open', async () => {
  try {
    await Creche.deleteMany({});
    await User.deleteMany({});

    await User.create(userSeeds);

    for (let i = 0; i < crecheSeeds.length; i++) {
      const { _id, crecheUser } = await Creche.create(crecheSeeds[i]);
      const user = await User.findOneAndUpdate(
        { username: crecheUser },
        {
          $addToSet: {
            creches: _id,
          },
        }
      );
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('all done!');
  process.exit(0);
});
