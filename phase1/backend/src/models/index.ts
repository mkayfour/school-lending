import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  logging: false
});

import UserModel from './user.ts';
import EquipmentModel from './equipment.ts';
import BorrowRequestModel from './borrowRequest.ts';

export const User = UserModel(sequelize);
export const Equipment = EquipmentModel(sequelize);
export const BorrowRequest = BorrowRequestModel(sequelize);

// Associations
User.hasMany(BorrowRequest, { foreignKey: 'userId' });
BorrowRequest.belongsTo(User, { foreignKey: 'userId' });

Equipment.hasMany(BorrowRequest, { foreignKey: 'equipmentId' });
BorrowRequest.belongsTo(Equipment, { foreignKey: 'equipmentId' });