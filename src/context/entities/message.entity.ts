import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { PAYMENTSTATUS, STEPS } from "../helpers/constants";

@Schema()
export class Message extends Document {

    @Prop({
    })
    clientId: string;

    @Prop({
    })
    clientName: string;


    @Prop({
    })
    clientPhone: string;

    @Prop({
    })
    dni: string;


    @Prop({
    })
    date: Date;

    @Prop({
        type: String,
        enum: STEPS,
        default: STEPS.INIT
    })
    step: string;

    @Prop({
        type: String,
        enum: PAYMENTSTATUS,
        default: PAYMENTSTATUS.PENDING
    })
    status: string;

    @Prop({
        default: 0
    })
    attempts: number;

    @Prop({
    })
    packId: string;

    @Prop({
    })
    modalitySelected: string;

    @Prop({
    })
    planSelected: string;

    @Prop({
    })
    price: number;

    @Prop({
    })
    paymentMethod: string;

    @Prop({
    })
    imageVoucher: string;

    @Prop({
    })
    code: string;

}

export const MessageSchema = SchemaFactory.createForClass(Message);
