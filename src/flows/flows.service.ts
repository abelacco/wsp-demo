import { Injectable } from '@nestjs/common';
import { BuilderTemplatesService } from 'src/builder-templates/builder-templates.service';
import { BTN_OPT_CONFIRM_DNI, BTN_OPT_CONFIRM_GENERAL, BTN_OPT_PAYMENT, MENU, NAME_TEMPLATES, PACK, PAYMENTSTATUS, STEPS } from 'src/context/helpers/constants';
import { Message } from 'src/context/entities/message.entity';
import { MULTIMEDIA_TYPES } from 'src/common/constants';
import { UserService } from 'src/user/user.service';
import { GeneralServicesService } from 'src/general-services/general-services.service';
import axios from 'axios';
import { IParsedMessage } from 'src/builder-templates/interface';
import { CtxService } from 'src/context/ctx.service';
import { SenderService } from 'src/sender/sender.service';
import { Utilities } from 'src/context/helpers/utils';
import { GoogleSpreadsheetService } from 'src/google-spreadsheet/google-spreadsheet.service';
import { SaleOrder } from 'src/google-spreadsheet/entities';

@Injectable()
export class FlowsService {

  constructor(
    private readonly builderTemplate: BuilderTemplatesService,
    private readonly userService: UserService,
    private readonly generalService: GeneralServicesService,
    private readonly ctxService: CtxService,
    private readonly senderService: SenderService,
    private readonly googleSpreadsheetService: GoogleSpreadsheetService,
    ) {
    }
  async initFlow(ctx:Message ,messageEntry: IParsedMessage) {
    // aca debo llamar al flow para registar al cliente , si es nuevo o si ya existe
    const client = await this.userService.findOrCreateClient({phone:messageEntry.clientPhone, name:messageEntry.clientName});
    const clientPhone = messageEntry.clientPhone;
    const message1 = `Hola ${client.name}, soy el asistente virtual de Diana Otero`;
    const message2 = 'Dando click en el boton de Menú podrás ver las opciones que tengo para ti';
    const template1 = this.builderTemplate.buildTextMessage(clientPhone,message1);
    await this.senderService.sendMessages(template1);
    const template2 = this.builderTemplate.buildInteractiveListMessage(clientPhone,'Ver menú 🔎' , MENU , null ,message2 ,null);
    await this.senderService.sendMessages(template2);
    ctx.step = STEPS.CHOOSE_MENU_OPT;
    await this.ctxService.updateCtx(ctx._id, ctx);
  }

  async servicesFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const clientPhone = messageEntry.clientPhone;
    const message = 'Estos son nuestros planes nutricionales';
    const type = MULTIMEDIA_TYPES.DOCUMENT
    const templatePdf = this.builderTemplate.buildMultimediaMessage(clientPhone,'document' , {id:'794058159198797', caption: message , filename: 'planes_nutricionales.pdf'});
    await this.senderService.sendMessages(templatePdf);
    // const messageInfo = 'Tómate tu tiempo para revisar los planes nutricionales, cuando estés list@ para continuar, selecciona el botón de "Continuar"';
    // const templateInfo = this.builderTemplate.buildTextMessage(clientPhone,messageInfo);
    // await this.senderService.sendMessages(templateInfo);
    const confirmMessagebtn = 'Tómate tu tiempo para revisar los planes nutricionales, cuando estés list@ para continuar, selecciona el botón de "Continuar"';
    const confirmOptions = BTN_OPT_CONFIRM_GENERAL;
    const templateContinue = this.builderTemplate.buildInteractiveButtonMessage(clientPhone,confirmMessagebtn, confirmOptions);
    await this.senderService.sendMessages(templateContinue);
    ctx.step = STEPS.CONTINUE_PURCHASE;
    await this.ctxService.updateCtx(ctx._id, ctx);
  }

  async askDniFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const clientPhone = messageEntry.clientPhone;
    const message = '¡Genial! Para continuar con tu compra, ingresa tu DNI para registrarte ✅';
    const template = this.builderTemplate.buildTextMessage(clientPhone,message);
    await this.senderService.sendMessages(template);
    ctx.step = STEPS.PUT_DNI;
    await this.ctxService.updateCtx(ctx._id, ctx);
  }

  async confirmDniFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const dniInfo = await this.generalService.findDocument(messageEntry.content);
    const fullname = `${dniInfo.nombres} ${dniInfo.apellidoPaterno} ${dniInfo.apellidoMaterno}`
    ctx.clientName = fullname;
    await this.ctxService.updateCtx(ctx._id, ctx);
    const clientPhone = messageEntry.clientPhone;
    const message = `¿Eres ${fullname}?`;
    const buttons = BTN_OPT_CONFIRM_DNI;
    const template =this.builderTemplate.buildInteractiveButtonMessage(clientPhone,message,buttons);
    await this.senderService.sendMessages(template);
  }

  async retryAskDniFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const clientPhone = messageEntry.clientPhone;
    const message = 'Vuelve a intentar con tu DNI';
    const template = this.builderTemplate.buildTextMessage(clientPhone,message);
    await this.senderService.sendMessages(template);
  }

  async choosePackFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const clientPhone = messageEntry.clientPhone;
    const buttonText = 'Ver packs';
    const sections = PACK;
    const headerText = 'Elige el pack que más te convenga';
    const bodyText = 'Para escoger un pack, selecciona el botón de "Ver packs"';
    const template = this.builderTemplate.buildInteractiveListMessage(clientPhone,buttonText ,sections, headerText, bodyText ,null);
    await this.senderService.sendMessages(template);
    ctx.step = STEPS.CHOOSE_PACK_OPT;
    await this.ctxService.updateCtx(ctx._id, ctx);
  }

  async notifyPaymentFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const clientPhone = messageEntry.clientPhone;
    const templateName:string = NAME_TEMPLATES.NOTIFY_PAYMENT;
    const languageCode = 'es';
    const headerImageUrl = ctx.imageVoucher ? ctx.imageVoucher : null;
    const bodyParameters = ['SERGIO TALLEDO CORONADO','MI MEJOR VERSIÓN', 'INTERCAMBIOS' , '120', '51947308823',]
    const template = this.builderTemplate.buildTemplateMessage(clientPhone, templateName ,languageCode, headerImageUrl,bodyParameters);
    await this.senderService.sendMessages(template);
  }

  async notifyNewConversationFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const clientPhone = messageEntry.clientPhone;
    const templateName:string = NAME_TEMPLATES.NEW_CONVERSATION;
    const languageCode = 'es';
    const bodyParameters = ['51947308823',]
    const template = this.builderTemplate.buildTemplateMessage(clientPhone, templateName ,languageCode, null ,bodyParameters);
    await this.senderService.sendMessages(template);
  }

  async confirmAppointmentFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const clientPhone = messageEntry.clientPhone;
    const availableDate = '12/12/2021';
    const message = ` El cupo disponible más próximo es el ${availableDate}`;
    await this.senderService.sendMessages(this.builderTemplate.buildTextMessage(clientPhone,message));
    const bodyText = '¿Deseas continuar?';
    const buttons = BTN_OPT_CONFIRM_GENERAL;
    const template = this.builderTemplate.buildInteractiveButtonMessage(clientPhone,bodyText,buttons);
    await this.senderService.sendMessages(template);
  }



  async choosePaymentFlow(ctx:Message ,messageEntry: IParsedMessage) {
    ctx.packId = messageEntry.content.id;
    ctx.modalitySelected = messageEntry.content.title;
    ctx.planSelected = Utilities.findPlanDetails(ctx.packId,ctx.modalitySelected);
    ctx.price = Utilities.obtenerPrecioPorPackId(ctx.packId);
    const clientPhone = messageEntry.clientPhone;
    const confirmTemplate = this.builderTemplate.buildTextMessage(clientPhone,`¡Genial ${ctx.clientName}!Has seleccionado el plan ${ctx.planSelected} en la modalidad ${ctx.modalitySelected} por S/. ${ctx.price}`);
    await this.senderService.sendMessages(confirmTemplate);
    const bodyText = 'Escoge el medio de pago que prefieras';
    const buttons = BTN_OPT_PAYMENT;
    const template = this.builderTemplate.buildInteractiveButtonMessage(clientPhone,bodyText,buttons);
    await this.senderService.sendMessages(template);
    ctx.step = STEPS.PROVIDER_PAYMENT_SELECTED;
    await this.ctxService.updateCtx(ctx._id, ctx);
  }

  async submitVoucherFlow(ctx:Message ,messageEntry: IParsedMessage) {
    ctx.paymentMethod = messageEntry.content.id;
    const clientPhone = messageEntry.clientPhone;
    const message = '☝️ Para terminar, por favor realizar el yape al 997967943 a nombre de Diana Otero y enviar una captura del pago en este chat ';
    const template = this.builderTemplate.buildTextMessage(clientPhone,message);
    await this.senderService.sendMessages(template);
    // const message2 = 'Una vez realizado el pago, envía el comprobante de pago para continuar con el proceso';
    // const template2 = this.builderTemplate.buildTextMessage(clientPhone,message2);
    // await this.senderService.sendMessages(template2);
    ctx.step = STEPS.SUBMIT_VOUCHER;
    await this.ctxService.updateCtx(ctx._id, ctx);
  }

  async waitingPaymentFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const url = await this.getWhatsappMediaUrl({imageId: messageEntry.content});
    const cloudinaryUrl =await this.generalService.uploadFromURL(url);
    ctx.imageVoucher = cloudinaryUrl.url;
    await this.notifyPaymentFlow(ctx,messageEntry);
    const clientPhone = messageEntry.clientPhone;
    const message = 'Estamos verificando tu comprobante de pago, esto tomará unos minutos por favor! 🙌';
    const template = this.builderTemplate.buildTextMessage(clientPhone,message);
    await this.senderService.sendMessages(template);
    ctx.step = STEPS.CONFIRM_PAYMENT;
    await this.ctxService.updateCtx(ctx._id, ctx);
  }

  async confirmationSaleFlow(ctx:Message ,messageEntry: IParsedMessage) {
    ctx.status = PAYMENTSTATUS.ACCEPTED;
    let clientname = ctx.clientName;
    let modalitySelected = ctx.modalitySelected;
    let planSelected = ctx.planSelected;
    let price = ctx.price;
    let turno = '12/02/2024';
    ctx.turn = turno;
    let purchase = '09/02/2024'
    ctx.purchase = purchase;
    let code = '123456';
    ctx.code = code;
    let saleOrder = new SaleOrder(ctx);
    await this.googleSpreadsheetService.insertData(0,saleOrder);
    const clientPhone = messageEntry.clientPhone;
    const message = '¡Felicidades! Tu compra ha sido confirmada, estos son los detalles de tu compra: \n\n' + `Cliente: ${clientname} \nModalidad: ${modalitySelected} \nPlan: ${planSelected} \nPrecio: S/. ${price} \nFecha de inicio: ${turno}`;
    const template = this.builderTemplate.buildTextMessage(clientPhone,message);
    await this.senderService.sendMessages(template);
    ctx.step = STEPS.INIT;
    await this.ctxService.updateCtx(ctx._id, ctx);
  }

   async getWhatsappMediaUrl({ imageId }: { imageId: string }) {
    const getImage = await axios.get(
      `https://graph.facebook.com/v18.0/${imageId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CURRENT_ACCESS_TOKEN}`,
        },
      },
    )
    .then((res) => res.data)
    .catch((error) => console.error(error));
    
    return getImage.url;
  }


}
