import { Op } from 'sequelize';

module.exports = (con,Sequelize) =>{
    const {STRING,INTEGER,DATE} = Sequelize
    const User = con.define("user",{
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name:{
            type:STRING,
            required: true
        },
        last_name:{
            type:STRING,
            required: true
        },
        email:{
            type:STRING,
            unique: true,
            required: true
        },
        username:{
            type:STRING,
            unique: true,
            required: true
        },
        password:{
            type:STRING,
            required: true
        },
        phone:{
            type:STRING,
            required: true
        },
        last_seen:{
            type:DATE,
            required: true
        },
        status:{
            type:INTEGER,
            defaultValue:0,
            required: true,
            comment: "(-1:restricted,0:new,1:active)"
        }
    }, {
        charset: 'latin1',
        collate: 'latin1_swedish_ci'
      }) 

    // Define the beforeCreate hook to prevent insertion of duplicate records
    User.beforeCreate(async (instance, options) => {
        // Check if a support record with the same email already exists
        const existingUser = await User.findOne({
            where: {
              [Op.or]: [
                { email: instance.email },
                { phone: instance.phone },
                { username: instance.username }
              ]
            }
        });
        
        if (existingUser) {
            throw new Error('User with the same email already exists');
        }
    });
    return User
}

