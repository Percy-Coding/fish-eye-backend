import mongoose from 'mongoose';

const parameterSchema = mongoose.Schema({
    name: String,
    unit: String,
    idealRange: {
        min:  Number,
        max: Number
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

export default mongoose.model('Parameter', parameterSchema);