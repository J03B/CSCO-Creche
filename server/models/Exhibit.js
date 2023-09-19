const { Schema, model } = require("mongoose");

const exhibitSchema = new Schema({
  creches: [
    {
      type: Schema.Types.ObjectId,
      ref: "Creche",
    },
  ],
},
{
  toJSON: {
    virtuals: true,
  },
  id: false,
});

exhibitSchema
  .virtual("totalCreches")
  // Getter
  .get(function () {
    return this.creches.length;
  })
  // Setter to set the first and last name
  .set(function (v) {
    const numCreches = v.length;
    this.set({ numCreches });
  });

const Exhibit = model("Exhibit", exhibitSchema);

module.exports = Exhibit;