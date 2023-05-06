import mongoose from 'mongoose';

const aquariumSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User"
    },
    smartDevice: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Device"
    },
    active: {
        type: Boolean,
        default: false
    },
    readings:[{
        _id: false,
        parameter: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Parameter"
        },
        values:[{
            _id: false,
            value: Number,
            timestamp: Date
        }]
    }],
    lastCommunication: {
        type: Date,
        default: null
    },
    geoLocation:{
        latitude: Number,
        altitude: Number
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

aquariumSchema.pre('save', async function(next){
    if(this.isModified()) {
        this.updatedAt = Date.now();
    }
    next();
})

export default mongoose.model('Aquarium', aquariumSchema);