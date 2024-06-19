import mongoose from "mongoose";
import Bookings from "../models/Bookings";
import Movie from "../models/Movie";
import User from "../models/User";

export const newBooking=async(req,res,next) =>{
    const {movie,date,seatNumber,user}=req.body;

    let existingMovie;
    let existingUser;

    try{
        existingMovie=await Movie.findById(movie);
        existingUser=await User.findById(user);
    }
    catch(err){
        return console.log(err);
    }

    if(!existingMovie){
        return res.status(404).json({message:"Movie not found with given ID"});
    }

    if(!user){
        return res.status(404).json({message:"User not found with given ID"});
    }


    let booking;

    try{
        booking=new Bookings({
            movie,date:new Date(`${date}`),
            seatNumber,
            user,
        });

        const session = await mongoose.startSession();
        session.startTransaction();
        existingUser.bookings.push(booking);
        existingMovie.Bookings.push(booking);
      //  existingMovie.bookings.push(booking);
        await existingUser.save({ session });
        await existingMovie.save({ session });
        await booking.save({ session });
        session.commitTransaction();
    }
    catch(err)
    {
        return console.log(err);
    }

    if(!booking)
        return res.status(500).json({message:"Unable to create a booking"});
    return res.status(201).json({booking});
};


export const getBookingById=async (req,res,next)=>{
    const id=req.params.id;
    let booking;
    try{
        booking=await Bookings.findById(id);
    }
    catch(err)
    {
        return console.log(err);
    }

    if(!booking)
        return res.status(500).json({message:"Unexpected Error"});

    return res.status(200).json({booking});
};
export const deleteBooking = async (req, res, next) => {
    const id = req.params.id;
    let booking;
  
    try {
      // Populate the user and movie fields
      booking = await Bookings.findByIdAndDelete(id).populate('user').populate('movie');
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      const session = await mongoose.startSession();
      session.startTransaction();
  
      if (booking.user && booking.user.bookings) {
        booking.user.bookings.pull(booking._id);
        await booking.user.save({ session });
      } else {
        console.log("User or user.bookings is undefined");
      }
  
      if (booking.movie && booking.movie.bookings) {
        booking.movie.bookings.pull(booking._id);
        await booking.movie.save({ session });
      } else {
        console.log("Movie or movie.bookings is undefined");
      }
  
      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "An error occurred while deleting the booking" });
    }
  
    return res.status(200).json({ message: "Successfully Deleted" });
  };