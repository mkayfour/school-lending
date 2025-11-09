'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BorrowRequests', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      equipmentId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Equipment', key: 'id' }, onDelete: 'CASCADE' },
      status: { type: Sequelize.ENUM('REQUESTED','APPROVED','REJECTED','RETURNED'), allowNull: false, defaultValue: 'REQUESTED' },
      borrowDate: { type: Sequelize.DATE, allowNull: false },
      returnDate: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('BorrowRequests');
  }
};