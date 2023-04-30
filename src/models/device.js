import mongoose from 'mongoose';

const deviceSchema = mongoose.Schema({
    embeddedSystem:{
        model: String,
        name: String
    },
    parameters:[{
        parameter: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Parameter"
        }
    }],
    broker: {
        provider: String,
        host: String,
        port: Number,
        accessUserName: String,
        accessPassword: String
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

export default mongoose.model('Device', deviceSchema);