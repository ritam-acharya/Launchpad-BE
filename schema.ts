import mongoose, { Schema } from "mongoose";

const tokenSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        symbol: {
            type: String,
            require: true,
            unique: true
        },
        description: {
            type: String,
            require: true
        },
        imageUrl: {
            type: String,       // URL
            require: true
        }
    },
    {
        timestamps: true
    }
);


const poolSchema = new Schema(
    {
        baseMint: {
            type: String,
            require: true
        },
        quoteMint: {
            type: String,
            require: true
        },
        baseTicker: {
            type: String,
            require: true
        },
        quoteTicker: {
            type: String,
            require: true
        },
        baseImg: {
            type: String,
            require: true
        },
        quoteImg: {
            type: String,
            require: true
        },
        baseDecimals: {
            type: Number,
            require: true
        },
        quoteDecimals: {
            type: Number,
            require: true
        },
        baseAmount: {
            type: Number
        },
        quoteAmount: {
            type: Number
        },
        poolAddress: {
            type: String,
            require: true
        }
    },
    {
        timestamps: true
    }
)

export const Token = mongoose.model("Token", tokenSchema);
export const Pool = mongoose.model("Pool", poolSchema);