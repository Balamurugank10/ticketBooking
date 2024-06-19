import Admin from "../models/Admin";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export const addAdmin = async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !email.trim() || !password || password.length < 6) {
        return res.status(422).json({ message: "Invalid input" });
    }

    let existingAdmin;
    try {
        existingAdmin = await Admin.findOne({ email });
    } catch (err) {
        return next(err);
    }

    // Check if admin already exists
    if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
    }

    let admin;
    try {
        // Generate hashed password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create new admin instance
        admin = new Admin({ email, password: hashedPassword });

        // Save admin to database
        admin = await admin.save();
    } catch (err) {
        return next(err);
    }

    // Check if admin is successfully saved
    if (!admin) {
        return res.status(500).json({ message: "Unable to store admin" });
    }

    return res.status(201).json({ admin });
};

export const adminLogin = async (req,res,next) =>{
    const {email,password}=req.body;

    if (!email || !email.trim() || !password || password.length < 6) {
        return res.status(422).json({ message: "Invalid input" });
    }

    let existingAdmin;

    try{
        existingAdmin=await Admin.findOne({email});

    }
    catch(err)
    {
        return console.log(err);
    }

    if(!existingAdmin)
        {
            return res.status(400).json({message:
                "Admin not found"
            });
        }

    const isPasswordCorrect=bcrypt.compareSync(password,existingAdmin.password);

    if(!isPasswordCorrect)
        {
            return res.status(400).json({message:"Incorrect password"});
        }

        const token=jwt.sign({id:existingAdmin._id},process.env.SECRET_KEY,{
            expiresIn: "7d",
        });

        return res.status(200).json({message:"Authentication success",token,id:existingAdmin._id });

};


export const getAdmins = async (req,res,next) =>{
    let admins;
    try{
        admins=await Admin.find();

    }
    catch(err)
    {
        return console.log(err);
    }

    if(!admins)
        {
            return res.status(500).json({message:"Internal server erroe"});
        }
        return res.status(200).json({admins});
};

export const getAdminById = async (req, res, next) => {
    const id = req.params.id;
  
    let admin;
    try {
      admin = await Admin.findById(id).populate("addedMovies");
    } catch (err) {
      return console.log(err);
    }
    if (!admin) {
      return console.log("Cannot find Admin");
    }
    return res.status(200).json({ admin });
  };