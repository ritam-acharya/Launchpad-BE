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

export const Token = mongoose.model("Token", tokenSchema);