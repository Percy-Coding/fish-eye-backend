import User from '../models/user';

export async function registerUser(req,res) {
    const { username } = req.body;
    let user = await User.findOne({ username: username});
    if (user) return res.status(409).json({message: 'User already registered'});

    user = new User(req.body);
    user
        .save()
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
    if (user == null) return res.status(401).json({message: 'Username or password incorrect'});

    if (await user.isValidPassword(password)){
        return res.status(200).json({
            message: `User ${username} successfully logged in`, 
            userId: user._id 
        });
    } else return res.status(401).json({message: 'Username or password incorrect'});

}