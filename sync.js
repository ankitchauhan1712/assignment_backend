// sync.js
const sequelize = require('./config/database');
const Account = require('./models/Account');

sequelize.sync({ force: true }).then(() => {
    console.log('Database & tables created!');
});
