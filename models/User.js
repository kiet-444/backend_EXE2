const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['user', 'admin', 'sales-admin', 'adopted-admin', 'sponsor'], 
        default: 'user' 
    },
    firstLogin: {
        type: Boolean, default: function () {
            return this.role === 'admin' ? true : undefined;
        }
    },
    address: { type: String },
    phoneNumber: { type: Number, unique: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
}, { timestamps: true });

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare hashed passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
