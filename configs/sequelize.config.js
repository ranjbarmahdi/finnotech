import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 5432,
    logging: JSON.parse(process.env.LOGGING.toLowerCase()),
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected To Db Successfully');
    } catch (error) {
        console.log('Can not connect to db');
        process.exit();
    }
})();

export default sequelize;
