import mongoose from 'mongoose'
import { QueryTypes } from 'sequelize'
import { connectMongoDB, connectMySQL, sequelize } from '@/config'
import {
  clearConversations,
  seedConversations
} from '@/seeders/nosql/seed-conversations'
import { clearMessages, seedMessages } from '@/seeders/nosql/seed-messages'

async function main() {
  console.log('Starting NoSQL seeders...\n')

  await connectMongoDB()
  await connectMySQL()
  console.log('Connected MongoDB and MySQL\n')

  try {
    console.log('Seeding conversations...')

    const aptRows = await sequelize.query(
      `
      SELECT DISTINCT id, patient_id, doctor_id
      FROM appointments
      WHERE status = 'completed'
      ORDER BY id ASC
      LIMIT 30;
    `,
      { type: QueryTypes.SELECT }
    )

    let pairs = aptRows

    if (aptRows.length === 0) {
      console.warn(
        'No completed appointments found - seeding with first 30 appointments instead'
      )
      pairs = await sequelize.query(
        `
        SELECT DISTINCT id, patient_id, doctor_id
        FROM appointments
        LIMIT 30;
      `,
        { type: QueryTypes.SELECT }
      )
    }

    await clearMessages()
    await clearConversations()

    const seededConversations = await seedConversations(pairs)

    console.log('Seeding messages...')
    await seedMessages(seededConversations)

    console.log('\nAll NoSQL seeders completed successfully!')
  } finally {
    await sequelize.close()
    await mongoose.disconnect()
    console.log('Connections closed.')
  }
}

main().catch((err) => {
  console.error('NoSQL seeder failed:', err)
  process.exit(1)
})
