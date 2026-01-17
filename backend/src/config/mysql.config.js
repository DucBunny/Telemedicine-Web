import { Sequelize } from 'sequelize'
import { env } from './env'

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

const connectMySQL = async () => {
  try {
    await sequelize.authenticate()
    console.log('MySQL connected successfully.')
  } catch (error) {
    console.error('Unable to connect to MySQL:', error)
  }
}

export { sequelize, connectMySQL }
