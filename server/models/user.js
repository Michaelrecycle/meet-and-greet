const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    accountType: {
        type: String,
        default: 'student'
    },
    inSession: {
        type: Boolean,
        default: false
    }
})

mongoose.model('User', UserSchema)