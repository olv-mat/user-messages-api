import * as bcrypt from 'bcrypt';
import { AppDataSource } from 'src/data-source';
import { RoutePolicies } from 'src/modules/auth/enums/route-policies.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';

// npm run seed:admin

export async function seedRoot(): Promise<void> {
  const { ROOT_USER_NAME, ROOT_USER_EMAIL, ROOT_USER_PASSWORD } = process.env;
  if (!ROOT_USER_NAME || !ROOT_USER_EMAIL || !ROOT_USER_PASSWORD) return;
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  try {
    const repository = AppDataSource.getRepository(UserEntity);
    const exists = await repository.exists({
      where: { email: ROOT_USER_EMAIL },
    });
    if (!exists) {
      const salt = await bcrypt.genSalt();
      await repository.save({
        name: ROOT_USER_NAME,
        email: ROOT_USER_EMAIL,
        password: await bcrypt.hash(ROOT_USER_PASSWORD, salt),
        policies: Object.values(RoutePolicies),
      });
    }
  } finally {
    await AppDataSource.destroy();
  }
}

void seedRoot();
