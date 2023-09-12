import mongoose from 'mongoose';
import { genSalt, hash as _hash, compare } from 'bcrypt';

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    expoPushToken:{
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    }
});

userSchema.pre('save', async function(next){
    if(this.isModified()) {
        this.updatedAt = Date.now();
    }
    if(this.isModified('password')){
        const salt = await genSalt(10);
        const hash = await _hash(this.password, salt);
        this.password = hash;
    }  
    next();
})

userSchema.methods.isValidPassword = async function (password) {
    try {
      return await compare(password, this.password);
    } catch (err) {
      throw err;
    }
  };

export default mongoose.model('User', userSchema);