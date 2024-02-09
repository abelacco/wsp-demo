import { Utilities } from "src/context/helpers/utils";

export class SaleOrder {
    compra: string;
    turno: string;
    code: string;
    celular: string;
    nombre: string;
    pack_id: string;
    plan: string;
    modalidad: string;
    monto: number;
    voucher: string;
  
    constructor(message: any) {
      this.compra = message.purchase || '';
      this.turno = message.turn || ''; // Define cómo establecer esto basado en tu lógica de aplicación
      this.code = message.code || '';
      this.celular = message.clientPhone || '';
      this.nombre = Utilities.parseFullName(message.clientName) || '';
      this.pack_id = message.packId || '';
      this.plan = message.planSelected || '';
      this.modalidad = message.modalitySelected || '';
      this.monto = message.price || 0;
      this.voucher = message.imageVoucher || '';
    }
}
