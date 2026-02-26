import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Pool, Token } from "./schema";
import cors from "cors";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.get("/api/v1/getPoolAddress/:baseMint/:quoteMint", async (req, res) => {
    const { baseMint, quoteMint } = req.params;
    try{
        const poolAddress1 = await Pool.findOne({
            baseMint: baseMint,
            quoteMint: quoteMint
        });

        const poolAddress2 = await Pool.findOne({
            baseMint: quoteMint,
            quoteMint: baseMint
        });

        const poolAddress = poolAddress1 || poolAddress2;

        if(!poolAddress) {
            res.status(404).json({
                success: false,
                message: "Pool not found for the given token pair"
            });
        }

        res.status(200).json({
            success: true,
            message: poolAddress
        });


    }catch(err) {
        res.status(500).json({
            success: false,
            message: err
        });
    }
});

app.get("/api/v1/pools", async (req, res) => {
    try {
        const pools = await Pool.find({});
        res.status(200).json({
            success: true,
            message: pools
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
});

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
            name: tokenDetails.name,
            symbol: tokenDetails.symbol,
            description: tokenDetails.description,
            imageUrl: tokenDetails.imageUrl
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

app.post("/api/v1/createPool", async (req, res) => {
    const { baseMint, quoteMint, baseTicker, quoteTicker, baseImg, quoteImg, baseDecimals, quoteDecimals, baseAmount, quoteAmount, poolAddress } = req.body;
    if (!baseMint || !quoteMint || !baseTicker || !quoteTicker || !baseImg || !quoteImg || !baseDecimals || !quoteDecimals || !baseAmount || !quoteAmount || !poolAddress) {
        res.status(401).json({
            success: false,
            message: "Incomplete information"
        });
        return;
    }

    try {
        const isExist = await Pool.findOne({
            baseMint,
            quoteMint
        });

        if(isExist) {
            return res.status(403).json({
                success: false,
                message: "Pool with these tokens already exist"
            });
        }

        const pool = await Pool.create({
            baseMint,
            quoteMint,
            baseTicker,
            quoteTicker,
            baseImg,
            quoteImg,
            baseDecimals,
            quoteDecimals,
            baseAmount,
            quoteAmount,
            poolAddress
        });

        if(!pool) {
            return res.status(500).json({
                success: false,
                message: "Failed to create pool"
            });
        }
        res.status(200).json({
            success: true,
            message: pool
        });
    }catch(error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
});

app.put("/api/v1/updatePool/:id", async (req, res) => {
    const pooAddress = req.params.id;
    const { baseAmount, quoteAmount } = req.body;
    if (!baseAmount || !quoteAmount) {
        res.status(401).json({
            success: false,
            message: "Incomplete information"
        });
        return;
    }

    try {
        const pool = await Pool.findOneAndUpdate({
            poolAddress: pooAddress
        }, {
            baseAmount,
            quoteAmount
        }, {
            new: true
        });

        if(!pool) {
            return res.status(404).json({
                success: false,
                message: "Pool not found"
            });
        }
        res.status(200).json({
            success: true,
            message: pool
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