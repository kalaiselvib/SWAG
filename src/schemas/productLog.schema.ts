import mongoose from "mongoose";
import { type InstanceType } from "typegoose";
import { SEQUENCE_NAMES } from "../constants/schema.constants";
import { logger } from "../logger/logger";
import { getNextSequence } from "../helpers/db.helpers";

const ProductLogSchema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: true,
    },
    employeeId: {
        type: String,
        required: true,
    },
    productBeforeEdit: {
        title: {
            type: String,
        },
        rewardPoints: {
            type: Number
        },
        isCustomisable: {
            type: Boolean
        },
        productImgURL: {
            type: String
        }
    },
    productAfterEdit: {
        title: {
            type: String,
        },
        rewardPoints: {
            type: Number
        },
        isCustomisable: {
            type: Boolean
        },
        productImgURL: {
            type: String
        }
    },
    timeStamp: {
        type: String,
        required: true,
    },
});

export type ProductLog = InstanceType<mongoose.InferSchemaType<typeof ProductLogSchema>>;

module.exports = mongoose.model("ProductLog", ProductLogSchema);