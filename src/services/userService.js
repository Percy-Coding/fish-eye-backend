import User from '../models/user.js';

export async function registerUser(req,res) {
    const { 
        username, 
        name, 
        lastName,
        password,
        dateOfBirth,
        email
    } = req.body;

    let user = await User.findOne({ username });
    if (user) return res.status(409).json({message: 'User already registered'});

    user = new User(
        username, 
        name, 
        lastName,
        password,
        dateOfBirth,
        email
    );

    user.save()
        .then((data) => {
            res.status(201).json({
                message: 'User created successfully',
                user: {...data, password: undefined}
            })
        })
        .catch((err) => res.json({ message: err }));
}

export async function login(req, res){
    const {username, password} = req.body;

    let user = await User.findOne({ username: username});
    if (user == null) return res.status(401).json({
        success: false, 
        message: 'Username or password incorrect'
    });

    if (await user.isValidPassword(password)){
        const userObject = user.toObject();
        delete userObject.password;
        return res.status(200).json({
            success: true,
            message: `User ${username} successfully logged in`, 
            user: userObject
        });
    } else return res.status(401).json({
        success: false, 
        message: 'Username or password incorrect'
    });

}

export async function getAllUsers(req, res) {
    try{
        const users = await User.find().select('-password');
        res.status(200).json({
            users: users,
            success: true
        });
    } catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        });
    }
}

export async function registerExpoToken(req, res){
    try{
        const expoPushToken = req.body.expoPushToken;
        const { userId } = req.params;
        let user = await User.findOne({ _id: userId});
        if (user == null) return res.status(404).json({
            success: false, 
            message: 'Resource not found'
        });
        user.expoPushToken = expoPushToken;
        await user.save();
    }catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        });
    }
}