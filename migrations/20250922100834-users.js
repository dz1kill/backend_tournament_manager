"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      nickname: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      rating: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },

      is_busy: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex("users", {
      name: "idx_users_not_busy",
      fields: ["is_busy"],
      where: {
        is_busy: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("users", "idx_users_not_busy");
    await queryInterface.dropTable("users");
  },
};
