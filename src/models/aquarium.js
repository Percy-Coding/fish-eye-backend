import mongoose from 'mongoose';

const aquariumSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    ownerId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User"
    },
    readings:[{
        parameter: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Parameter"
        },
        values:[{
            value: Number,
            timestamp: Date
        }]
    }],
    lastCommunication: Date,
    location:{

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

export default mongoose.model('Aquarium', aquariumSchema);