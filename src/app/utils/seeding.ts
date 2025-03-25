import config from '../config';
import { USER_ROLE } from '../modules/User/user.constant';
import User from '../modules/User/user.model';

const seedingAdmin = async () => {
  try {
    // at first check if the admin exist of not
    const admin = await User.findOne({
      role: USER_ROLE.SUPER_ADMIN,
      email: config.super_admin.email,
    });
    if (!admin) {
      await User.create({
        firstName: 'Super',
        lastName: 'Admin',
        role: USER_ROLE.SUPER_ADMIN,
        email: config.super_admin.email,
        password: config.super_admin.password,
        image: config.super_admin.profile_photo,
        isVerified: true,
      });
    }
  } catch {
    console.log('Error seeding super admin');
  }
};

export default seedingAdmin;
