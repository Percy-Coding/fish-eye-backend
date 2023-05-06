import Device from '../models/device.js';

export async function createDevice(req,res) {
    const device = new Device({
        embeddedSystem: req.body.embeddedSystem,
        parameters: req.body.parameters,
        broker: req.body.broker
    });

    device.save()
        .then((data) => {
            res.status(201).json({
                message: 'Device created successfully',
                device: data
            })
        })
        .catch((err) => res.json({ message: err }));
}
