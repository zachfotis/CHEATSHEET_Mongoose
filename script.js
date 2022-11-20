const mongoose = require('mongoose');
const User = require('./User');

// It takes 4 arguments
// 1. Connection string
// 2. Options
// 3. Callback function when connection is established
// 4. Callback function when connection fails
mongoose.connect(
  'mongodb://root:example@localhost:27017/MongooseCrashCourse?authSource=admin',
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('Connected to MongoDB'),
  (err) => console.log(err)
);

run();

async function run() {
  // await createUser();
  // await findUser();
  // await updateUser();
  // await deleteUser();

  // await searchWithQuery();
  // await useMethods();
  // await useStatics();
  // await useCustomQuery();
  // await useVirtual();
  await useMiddleware();
}

async function createUser() {
  try {
    // Method #1
    // const user = User.create({
    //   name: 'John',
    //   age: 30,
    //   });

    // Method #2
    const user = new User({
      name: 'John',
      age: 30,
      email: 'Zaxfotis2@gmail.com',
      hobbies: ['Reading', 'Writing'],
      address: {
        street: '123 Main St',
        city: 'Boston',
      },
    });
    await user.save();

    // Change the name (works for both methods)
    user.name = 'Jane';
    await user.save();

    console.log(`User created: ${user}`);
  } catch (error) {
    console.log(error.message);
  }
}

async function findUser() {
  try {
    // const user = await User.findById('637a38e2ce5691cab0997408');
    // const user = await User.find({ name: 'Jane' });
    const user = await User.findOne({ name: 'Jane' });
    console.log(`User found: ${user}`);
  } catch (error) {
    console.log(error.message);
  }
}

async function updateUser() {
  try {
    // const user = await User.findById('637a38e2ce5691cab0997408');
    const user = await User.findOne({ name: 'Jane' });
    user.bestFriend = '637a41e4fb7a386ee0964da5';
    await user.save();
    console.log(`User updated: ${user}`);
  } catch (error) {
    console.log(error.message);
  }
}

async function deleteUser() {
  try {
    const user = await User.deleteOne({ name: 'Fotis' });
    console.log(`Users deleted: ${user.deletedCount}`);
  } catch (error) {
    console.log(error.message);
  }
}

async function searchWithQuery() {
  try {
    // available operators: https://docs.mongodb.com/manual/reference/operator/query/
    const user = await User.where('name')
      .equals('Fotis')
      .where('age')
      .gt(18)
      .limit(1) // limit the number of results
      .sort({ name: 1 }) // 1: ascending, -1: descending
      .select({ name: 1, age: 1 }) // Get only name and age. Use 1 for true and 0 for false. If you want to exclude a field use -1
      .populate('bestFriend'); // Get the bestFriend object

    console.log(`User found: ${user}`);
  } catch (error) {
    console.log(error.message);
  }
}

async function useMethods() {
  try {
    const user = await User.find({ name: 'Jane' });
    user[0].sayHello();
  } catch (error) {
    console.log(error.message);
  }
}

async function useStatics() {
  try {
    // statics cannot be used on the document, it must be used on the model itself
    const user = await User.findByName('Jane');
    console.log(`User found: ${user}`);
  } catch (error) {
    console.log(error.message);
  }
}

async function useCustomQuery() {
  try {
    // query cannot be used on the model itself, it must be used on the document
    const user = await User.find().byName('Jane');
    console.log(`User found: ${user}`);
  } catch (error) {
    console.log(error.message);
  }
}

async function useVirtual() {
  try {
    const user = await User.findOne({ name: 'Jane' });
    console.log(`User found: ${user.namedEmail}`);
  } catch (error) {
    console.log(error.message);
  }
}

async function useMiddleware() {
  try {
    const user = await User.findOne({ name: 'Jane' });
    user.save();
    console.log(`Updated at: ${user.updatedAt}`);
  } catch (error) {
    console.log(error.message);
  }
}
