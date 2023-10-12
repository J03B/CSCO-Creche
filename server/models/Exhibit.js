const { Schema, model } = require("mongoose");

const exhibitSchema = new Schema({
  exhibitYear: {
    type: Number,
    required: true,
    minlength: 1,
    maxlength: 4,
  },
  creches: [
    {
      type: Schema.Types.ObjectId,
      ref: "Creche",
    },
  ],
},
{
  id: false,
});

const Exhibit = model("Exhibit", exhibitSchema);

module.exports = Exhibit;
