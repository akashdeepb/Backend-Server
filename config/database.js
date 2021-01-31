const mongoose = require('mongoose');
const db_uri2 = 'mongodb://adminUser:password123@localhost:27017/ksrp';
const db_uri = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    poolSize: 10
}

mongoose.connect(db_uri,options).then(
    () => {
        console.log("Database Connection Established");
    },
    err => {
        console.log("Error Connecting To Database. Error : " + err);
    }
);