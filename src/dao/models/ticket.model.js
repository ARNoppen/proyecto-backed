import mongoose from "mongoose";
import { v4 as uuid4 } from "uuid";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: uuid4
    },
    purchase_datetime: {
        type: Date,
        default: Date.now // Fecha y hora de la compra
      },
    amount: {
        type: Number,
        required: true
      },
    purchaser: {
        type: String,
        required: true
      }
},
    {
        versionKey: false //Deshabilita el parametro "__v" 
    }
);

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);