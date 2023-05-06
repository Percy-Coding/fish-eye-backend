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
        },
        
    }],
    broker: {
        provider: String,
        host: String,
        port: Number,
        accessUserName: String,
        accessPassword: String,
        protocol: String
    },
    usedByAquarium: {
        type: Boolean,
        default: false
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

deviceSchema.pre('save', async function(next){
    if(this.isModified()) {
        this.updatedAt = Date.now();
    }
    next();
})

export default mongoose.model('Device', deviceSchema);