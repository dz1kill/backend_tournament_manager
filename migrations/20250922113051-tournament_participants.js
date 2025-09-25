"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tournament_participants", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      tournament_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tournaments",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      is_eliminated: {
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
    await queryInterface.addIndex("tournament_participants", {
      name: "idx_tournament_participants_available",
      fields: ["tournament_id", "is_eliminated", "user_id"],
    });

    await queryInterface.addConstraint("tournament_participants", {
      fields: ["tournament_id", "user_id"],
      type: "unique",
      name: "unique_tournament_user",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tournament_participants");
    await queryInterface.removeIndex(
      "tournament_participants",
      "idx_tournament_participants_available"
    );
  },
};
