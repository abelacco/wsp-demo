import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { PAYMENTSTATUS, STEPS } from "../helpers/constants";

@Schema()
export class Message extends Document {

    @Prop({
    })
    hourSelected: string;

    @Prop({
    })
    paymentOptionSelected: string;

    @Prop({
    })
    date: string;

    @Prop({
    })
    clientName: string;

    @Prop({
    })
    clientPhone: string;

    @Prop({
    })
    amount: number;

    @Prop({
        type: String,
        enum: STEPS,
        default: STEPS.INIT
    })
    step: string;


    @Prop({
        default: 0
    })
    attempts: number;

    @Prop({
        type: String,
        enum: PAYMENTSTATUS,
        default: PAYMENTSTATUS.PENDING
    })
    paymentStatus: string;

}



export const MessageSchema = SchemaFactory.createForClass(Message);
