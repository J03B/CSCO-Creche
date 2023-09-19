const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must match an email address!'],
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/, 'Must match a valid phone number!']
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  creches: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Creche',
    },
  ],
},{
  toJSON: {
    virtuals: true,
  },
  id: false,
});

userSchema
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

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;
