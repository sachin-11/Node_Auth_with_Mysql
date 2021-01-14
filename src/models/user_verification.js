module.exports = (sequelize, Sequelize) => {
    const  user_verification = sequelize.define("user_verifications", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(150),
            allowNull: true
        },
        code: {
            type: Sequelize.INTEGER(11),
            allowNull: true
        },
        created_at: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        }
    },{timestamps: false});

    return  user_verification;
};

