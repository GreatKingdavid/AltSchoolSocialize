const User = require('../models/User')
const register = async (userData) => {
    const {first_name, last_name, username, email, password} = userData

    if (!first_name || !last_name || !username || !email || !password) {
        return {
            success:false,
            statusCode: 400,
            message: 'Please provide all required fields'
        }
    }

    if (password.length < 8) {
        return{
            success:false,
            statusCode: 400,
            message: 'Password must be at least 8 characters'
        }
    }

    const existingUser = await User.findOne({
        $or: [{email}, {username}]
    })

if (existingUser) {
    let field = 'email'
    if (existingUser.username === username) {
        field = 'username'
    }

    return{
        success: false,
        statusCode: 409,

        message: `user with this ${field} already exists`
    }
}

// create the user in database
const newUser = await User.create({
    first_name: first_name,
    last_name: last_name,
    username: username,
    email: email,
    password: password
})

// remove password before sending back
const userWithoutpassword = user.toObject()
delete
userWithoutpassword.password

return {
    success: true,
    statusCode: 201,
    message: `User created successfully`,
    user: userWithoutpassword
}
}
