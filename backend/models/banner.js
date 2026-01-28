'use strict'

module.exports = (sequelize, DataTypes) => {
  const Banner = sequelize.define(
    'Banner',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'banners',
      timestamps: true
    }
  )

  return Banner
}
