module.exports = (con,Sequelize) =>{
    const {STRING,INTEGER,DATE} = Sequelize
    const Administrator = con.define("administrator",{
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
    Administrator.beforeCreate(async (instance, options) => {
        // Check if a support record with the same email already exists
        const existingAdministrator = await Administrator.findOne({ where: { email: instance.email } });
        console.log({existingAdministrator})
        if (existingAdministrator) {
            throw new Error('Administrator with the same email already exists');
        }
    });
    return Administrator
}

