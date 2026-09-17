import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  const profiles = [
    { name: 'Divyesh', email: 'divyesh@example.com', bio: 'Creator of amazing content', role: Role.CUSTOMER },
    { name: 'Mayuresh', email: 'mayuresh@example.com', bio: 'Tech reviewer and influencer', role: Role.CUSTOMER },
    { name: 'Vedant', email: 'vedant@example.com', bio: 'Lifestyle vlogger', role: Role.CUSTOMER },
    { name: 'Yogesh', email: 'yogesh@example.com', bio: 'Gaming streamer', role: Role.CUSTOMER },
  ]

  for (const profile of profiles) {
    const user = await prisma.user.upsert({
      where: { email: profile.email },
      update: {},
      create: {
        email: profile.email,
        role: profile.role,
        artist: {
          create: {
            name: profile.name,
            bio: profile.bio,
          },
        },
      },
    })
    console.log(`Created/updated user with artist profile for ${profile.name}`)
  }

  // Also create a test admin user for the staff dashboard
  await prisma.user.upsert({
    where: { email: 'admin@creatorcast.local' },
    update: {},
    create: {
      email: 'admin@creatorcast.local',
      role: Role.ADMIN,
    },
  })
  console.log('Created/updated admin user')

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
