const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  age: {
    type: Number,
    min: 18,
    max: 65,
    // build-in or custom validation runs only when the document is saved or created
    validate: {
      validator: (v) => v % 2 === 0,
      message: (props) => `${props.value} is not an even number!`,
    },
  },
  email: {
    type: String,
    minLength: 5,
    required: true,
    unique: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
  bestFriend: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  hobbies: [String],
  address: addressSchema,
});

// METHODS (avoid using arrow functions because they do not bind the this keyword)
userSchema.methods.sayHello = function () {
  console.log(`Hello, my name is ${this.name}`);
};

// STATICS
userSchema.statics.findByName = function (name) {
  return this.find({ name: new RegExp(name, 'i') });
};

// CUSTOM QUERY
userSchema.query.byName = function (name) {
  // use where to be able to chain other methods
  return this.where({ name: new RegExp(name, 'i') });
};

// VIRTUAL PROPERTIES
// Virtual properties are not stored in the database
// They are calculated properties
userSchema.virtual('namedEmail').get(function () {
  return `${this.name} <${this.email}>`;
});

// MIDDLEWARE
// Pre middleware
// Runs before the document is saved
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Post middleware
// Runs after the document is saved
userSchema.post('save', function (doc, next) {
  console.log(`Document saved!`);
  next();
});

module.exports = mongoose.model('users', userSchema);
