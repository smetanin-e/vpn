import { generateSalt, hashPassword } from '@/src/shared/lib/auth/password-utils';
import { prisma } from '@/src/shared/lib/prisma';

async function main() {
  const salt = generateSalt();
  const password = await hashPassword('12345678', salt);

  const user = await prisma.user.create({
    data: {
      name: 'Admin',
      login: 'Admin',
      password,
      salt,
    },
  });
  console.log('Created user:', user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
