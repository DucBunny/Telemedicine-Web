'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class PatientDetail extends Model {
    static associate(models) {
      // Thuộc về tài khoản User chính (Quan hệ 1-1)
      PatientDetail.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'userAccount'
      })

      // Thuộc về Bác sĩ phụ trách (Quan hệ N-1)
      PatientDetail.belongsTo(models.User, {
        foreignKey: 'doctorId',
        as: 'doctor'
      })
    }
  }

  PatientDetail.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Vì quan hệ 1-1 nên dùng luôn ID của User làm khóa chính
        allowNull: false
      },
      dateOfBirth: DataTypes.DATEONLY,
      gender: DataTypes.ENUM('male', 'female', 'other'),
      bloodType: DataTypes.STRING,
      height: DataTypes.FLOAT,
      weight: DataTypes.FLOAT,
      medicalHistory: DataTypes.TEXT,
      address: DataTypes.STRING,
      doctorId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'PatientDetail'
    }
  )

  return PatientDetail
}
