module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        firstname: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        lastname: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(150),
            allowNull: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: true
        },
        google_id:{
            type: Sequelize.STRING,
            allowNull: true,
        },
        facebook_id:{
            type: Sequelize.STRING,
            allowNull: true,
        },
        roles:{
            type: Sequelize.ENUM,
            values: ['user', 'admin'],
            allowNull: false
        },
        status:{
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        is_verified:{
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        reset_token:{
            type: Sequelize.STRING,
            allowNull: true
        },
        profile_pic:{
            type: Sequelize.STRING,
            allowNull: true
        },
        created_at:{
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        updated_at:{
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
    },{timestamps: false});

    return Users;
};
