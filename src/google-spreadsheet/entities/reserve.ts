import { Message } from "src/context/entities/message.entity";
import { Utilities } from "../../context/helpers/utils";

export class Book {
    ftransaccion: string;
    freserva: string;
    nombre: string;
    dni: string;
    celular: string;
    inicio: string;
    final: string;
    monto: number;
    modalidad: string;
    voucher: string;
    constructor(message: Message) {
        this.ftransaccion = Utilities.getTodayDate();
        this.freserva = message.date;
        this.nombre = message.clientName;
        this.celular = message.clientPhone;
        this.inicio = message.hourSelected;
        this.final = message.rowHourSelected;
        this.monto = message.amount;
        this.modalidad = message.paymentOptionSelected || 'Yape';
        this.voucher = message.imageVoucher;
    }

  
}
