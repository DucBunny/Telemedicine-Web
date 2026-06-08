import { Sequelize } from 'sequelize'
import { env } from '@/config'

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: env.DB_DIALECT,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
    },
  },
})

const connectMySQL = async () => {
  try {
    await sequelize.authenticate()
    console.log('[MySQL] Connected successfully.')
  } catch (error) {
    console.error('[MySQL] Unable to connect to MySQL:', error)
  }
}

export { sequelize, connectMySQL }
