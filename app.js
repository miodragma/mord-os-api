const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const sequelize = require('./db/dabatase');

/* Middlewares */
const errorMiddleware = require('./middleware/error');

/* Routes */
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');
const groupRoutes = require('./routes/group');

/* Models */
const User = require('./models/user');
const File = require('./models/file');
const Group = require('./models/group');
const UsersGroups = require('./models/users-groups');

const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

app.use('/auth', authRoutes);
app.use('/file', fileRoutes);
app.use('/group', groupRoutes);

app.use(errorMiddleware);

File.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(File);

File.belongsTo(Group, { constraints: true, onDelete: 'CASCADE' })
Group.hasMany(File);

User.belongsToMany(Group, { through: UsersGroups });
Group.belongsToMany(User, { through: UsersGroups })


sequelize.sync()
  .then(result => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch(err => console.log(err))
