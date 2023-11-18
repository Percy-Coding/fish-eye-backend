import Parameter from '../models/parameter.js';

export async function createParameter(req,res) {
    try{
        console.log('Creating parameter');
        const parameter = new Parameter({
            name: req.body.name,
            unit: req.body.unit,
            idealRange: req.body.idealRange
        });
    
        parameter.save()
            .then((data) => {
                res.status(201).json({
                    message: 'Parameter created successfully',
                    parameter: data
                })
                console.log(`Parameter created successfully with id: ${data._id}`)
            })
            .catch((err) => res.json({ message: err }));
    }catch(err){
        console.log(err);
    }
    
}

export async function getAllParameters(req, res){
    try{
        const parameters = await Parameter.find();
        res.status(200).json(parameters);
    } catch(err){
        res.status(500).json({message: err.message});
    }
}

export async function editParameter(req, res){
    const {parameterId} = req.params;
    console.log(req.params);
    console.log(req.body);
    try{
        const response = await Parameter.updateOne({_id: parameterId}, req.body);
        
        if(response.modifiedCount === 0) {
            return res.status(404).json({failed: `The parameter with id ${parameterId} was not found or was not updated`});
        }
        
        res.status(200).json({success: `The parameter with id ${parameterId} was updated successfully`});
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

export async function getParameterById(req, res){
    const {parameterId} = req.params;
    console.log(req.params);
    try{
        const parameter = await Parameter.findById(parameterId);
        if (parameter == null) return res.status(404).json({message: err.message});

        res.status(200).json({ parameter });
    }catch(err){
        res.status(500).json({message: err.message});
    }
}
