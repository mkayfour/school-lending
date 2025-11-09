import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  return sequelize.define('BorrowRequest', {
    status: { type: DataTypes.ENUM('REQUESTED','APPROVED','REJECTED','RETURNED'), defaultValue: 'REQUESTED' },
    borrowDate: { type: DataTypes.DATE, allowNull: false },
    returnDate: { type: DataTypes.DATE, allowNull: false }
  }, { tableName: 'BorrowRequests' });
};