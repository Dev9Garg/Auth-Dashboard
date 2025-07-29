import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.NEON_DB_URI, {
  logging: false
});

const connectdb = async () => {
    try {
        const connection = await sequelize.authenticate();

        console.log(connection);
        
        console.log("Neon DB connected successfully !");

    } catch (error) {
        console.log("Error in connecting to the database - ", error);
    }
}

export {connectdb, sequelize};