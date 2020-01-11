const mongoose = require('mongoose')
const ObjectID = require('bson').ObjectID;
require('custom-env').env();
const { UserModel } = require('./src/user/users_model')

async function seed() {

    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true });

    if (await UserModel.countDocuments() > 0) {
        console.log('Users - Already Exist');
        return;
    }

    let user = {
        email: 'mohammedalbehairy90@gmail.com',
        name: 'mohammed'
    }

    user = new UserModel(user);
    user.setPassword('123456')

    await user.save(user);
    console.log('User - Created Successfully');

    let user2 = {
        email: 'mo@mo.com',
        name: 'mo'
    }
    user2 = new UserModel(user2);
    user2.setPassword('123456')

    await user2.save(user2);
    console.log('User - Created Successfully');

    let user3 = {
        email: 'ali@ali.com',
        name: 'ali'
    }
    user3 = new UserModel(user3);
    user3.setPassword('123456')

    await user3.save(user3);
    console.log('User - Created Successfully');
    mongoose.disconnect();

}

seed()