import { Sequelize } from 'sequelize'
import { env } from './environment.js'

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: env.DB_DIALECT,
  timezone: '+07:00',
  logging: false,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
    ssl: {
      require: true,
      rejectUnauthorized: true
    }
  }
})

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

export { sequelize, connectDB }
