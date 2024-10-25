import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
// import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getUserChannelSubscribers = asyncHandler(async(req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Subscriber id is missing")
    }

    // const channels = await Subscription.find({channel : new mongoose.Types.ObjectId(channelId)})
    // .select("-updatedAt -createdAt -channel -__v");

    const channels = await Subscription.aggregate([
        {
            $match : { channel : new mongoose.Types.ObjectId(channelId) }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "username"
            }
        },
        {
            $addFields : {
                dummyfield : ':)'
            }
        },
        {
            $project : {
                subscriber :1,
                username: {
                    $map: {
                        input: "$username",
                        as: "user",
                        in: {
                            username: "$$user.username",  // Project only the username field
                            name: "$$user.fullname",  // Project only the fullname field
                            avatar : "$$user.avatar"
                        }
                    }
                },
                dummyfield : 1
            }
            
        }
    ]);
    
    if (!channels?.length) {
        throw new ApiError(404, "channel does not exists")
    }
  
    return res.status(200).json(new ApiResponse(200, channels, "Successfully fecthed subscribers list"));
});

const toggleSubscription = asyncHandler( async(req, res) => {

    const { subscriberId, channelId } = req.body; // Get user and channel IDs from the request

    // Check if the user is already subscribed to the channel
    const subscription = await Subscription.findOne({
        subscriber: new mongoose.Types.ObjectId(subscriberId),
        channel: new mongoose.Types.ObjectId(channelId)
    });
    
    // console.log('dd= ',subscriberId, channelId);
    // console.log('dd= ',subscription);

    let subscribed = false;
    if (subscription) {
        // If a subscription exists, unsubscribe (delete the subscription)
        await Subscription.deleteOne({ _id: subscription._id });
    } else {
        // If no subscription exists, subscribe (create a new subscription)
        const createdSubscription = await Subscription.create({
            subscriber: subscriberId,
            channel: channelId
        });
        subscribed = true;
        // console.log('dd ======= ',createdSubscription);
    }

    return res.status(200).json(
        new ApiResponse(200, { subscribed }, `${(subscribed) ? 'Subscribed' : 'UnSubscribed'} successfully.`)
        );
});

const getSubscribedChannels = asyncHandler ( async (req, res)=> {
    const {subscriberId} = req.params;
    
    // const testd = await Subscription.find({subscriber : new mongoose.Types.ObjectId(subscriberId)});
    // const testd = await Subscription.findById('670a74e8c8d2274dbb8dc9f6');
    // const testd = await Subscription.find({subscriber : '6706de572916f0ae99364a23'});
    
    // console.log(subscriberId, testd);
    const subscriptions = await Subscription.aggregate([
        {
            $match : { subscriber : new mongoose.Types.ObjectId(subscriberId) }
        },
        {
          $lookup : {
            from: "users",
            localField: "subscriber",
            foreignField: "_id",
            as: "username"
          }
        },
        {
            $project : {
                channel : 1,
                username: {
                    $map: {
                        input: "$username",
                        as: "user",
                        in: {
                            username: "$$user.username",  // Project only the username field
                            name: "$$user.fullname",  // Project only the fullname field
                            avatar : "$$user.avatar"
                        }
                    }
                },

            }
        }
    ]);

    if(!subscriptions?.length) {
        throw new ApiError(404, "Subscribed channels does not exists")
    }

    return res.status(200).json(new ApiResponse(200, subscriptions, "Successfully fecthed subscribed channels list"));
});

export { getSubscribedChannels, toggleSubscription, getUserChannelSubscribers }