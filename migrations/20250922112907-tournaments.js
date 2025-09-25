"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tournaments", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },

      status: {
        type: Sequelize.ENUM("pending", "running", "finished"),
        allowNull: false,
        defaultValue: "pending",
      },

      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      finished_at: {
        type: Sequelize.DATE,
        allowNull: true,
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tournaments");
  },
};
