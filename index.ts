import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Token } from "./schema";
import cors from "cors";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.get("/api/v1/:_id", async (req, res) => {
    const tokenId = req.params._id;
    try{
        const tokenDetails = await Token.findById(tokenId);
        if (!tokenDetails) {
            res.status(404).json({
                success: false,
                message: "Token details not found"
            });
            return;
        }
        console.log("token details : ", tokenDetails);
        res.status(200).json({
            success: true,
            message: tokenDetails
        });
    }catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error
        });
    }
});

app.post("/api/v1/upload", async (req, res) => {
    const { name, symbol, description, imageUrl } = req.body;
    if (!name || !symbol || !description || !imageUrl) {
        res.status(401).json({
            success: false,
            message: "Incomplete information"
        });
        return;
    }
    try{
        const ifExist = await Token.findOne({
            symbol
        });

        if(ifExist) {
            res.status(403).json({
                success: false,
                message: "Token with this Symbol already exist"
            });
        }
        const token = await Token.create({
            name,
            symbol,
            description,
            imageUrl
        });
        console.log('Token data : ', token);
        res.status(200).json({
            success: true,
            message: token
        });
    }catch(error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
});


const port = process.env.PORT ? process.env.PORT : 10000;
app.listen(port, async () => {
    try{
        await mongoose.connect(`${process.env.DATABASE_URI}/${process.env.DATABASE_NAME}`);
        console.log("DATABASE connection establish");
        console.log("App is running on : ", port);
    }catch(error) {
        console.log(error);
        process.exit(1);
    }
});