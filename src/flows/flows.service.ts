import { Injectable } from '@nestjs/common';
import { BuilderTemplatesService } from 'src/builder-templates/builder-templates.service';
import { BTN_ID, BTN_OPT_CONFIRM_DNI, BTN_OPT_CONFIRM_GENERAL, BTN_OPT_DATES, BTN_OPT_PAYMENT, MENU, NAME_TEMPLATES, STEPS } from 'src/context/helpers/constants';
import { Message } from 'src/context/entities/message.entity';
import { UserService } from 'src/user/user.service';
import { GeneralServicesService } from 'src/general-services/general-services.service';
import axios from 'axios';
import { IParsedMessage } from 'src/builder-templates/interface';
import { CtxService } from 'src/context/ctx.service';
import { SenderService } from 'src/sender/sender.service';
import { Utilities } from 'src/context/helpers/utils';
import { GoogleSpreadsheetService } from 'src/google-spreadsheet/google-spreadsheet.service';
import { Expense } from 'src/google-spreadsheet/entities';

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
    const clientPhone = messageEntry.clientPhone;
    const clientName = messageEntry.clientName;
    ctx.clientName = clientName;
    ctx.clientPhone = clientPhone;
    const message1 = `Hola ${clientName},soy el bot asistente de reservas de La Plata, paro mi balón pero mi puesto es ayudarte a reservar una cancha de futbol.`;
    const template1 = this.builderTemplate.buildTextMessage(clientPhone,message1);
    await this.senderService.sendMessages(template1);
    const message2 = 'Escoge uno de los botones de abajo para continuar';
    const template2 = this.builderTemplate.buildInteractiveButtonMessage(clientPhone,message2,BTN_OPT_DATES);
    const template3 = this.builderTemplate.buildTextMessage(clientPhone,'*ESTO ES UN BOT DE PRUEBA DESARROLLADO POR THE FAMILY BOT \nNO ES UN CANAL OFICIAL DE DOERS, MAYOR INFORMACÓN DIRECTAMEN EN SUS RRSS*');
    await this.senderService.sendMessages(template3);
    ctx.step = STEPS.CHOOSE_DATE_OPT;
    await this.ctxService.updateCtx(ctx._id, ctx);
  }

  async dateChoosedFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const clientPhone = messageEntry.clientPhone;
    ctx.date = messageEntry.content.title;
    const message = `Has seleccionado la fecha ${ctx.date}, ahora selecciona la hora`;
    const template = this.builderTemplate.buildTextMessage(clientPhone,message);
    await this.senderService.sendMessages(template);
    await this.ctxService.updateCtx(ctx._id, ctx);
    await this.listHoursFlow(ctx,messageEntry);

  }

  async listHoursFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const clientPhone = messageEntry.clientPhone;
    const listHours = await this.googleSpreadsheetService.getAvailableSlotsForDate(ctx.date);
    if(listHours.length === 0) {
      const message = 'No hay horarios disponibles para la fecha seleccionada';
      const template = this.builderTemplate.buildTextMessage(clientPhone,message);
      await this.senderService.sendMessages(template);
      return;
    }
    const headerText = 'Elige la hora que deseas reservar';
    const bodyText = 'Para escoger una hora, selecciona el botón de "Ver horarios"';
    const buttonText = 'Ver horarios';
    const sections = Utilities.generateOneSectionTemplate('Lista de horarios',listHours); // Wrap sections inside an array
    const template = this.builderTemplate.buildInteractiveListMessage(clientPhone,buttonText ,sections, headerText, bodyText);
    await this.senderService.sendMessages(template);
    ctx.step = STEPS.CHOOSE_HOUR_OPT;
    await this.ctxService.updateCtx(ctx._id, ctx);
  }

  async paymentOptionFlow(ctx:Message ,messageEntry: IParsedMessage) {
    ctx.hourSelected = messageEntry.content.title;
    const clientPhone = messageEntry.clientPhone;
    const message = 'Selecciona el método de pago';
    const template = this.builderTemplate.buildInteractiveButtonMessage(clientPhone,message,BTN_OPT_PAYMENT);
    await this.senderService.sendMessages(template);
    ctx.step = STEPS.CHOOSE_PAYMENT_OPT;
    await this.ctxService.updateCtx(ctx._id, ctx);
  }

  async yapeFlow(ctx:Message ,messageEntry: IParsedMessage) {
    ctx.paymentOptionSelected = messageEntry.content.id;
    const clientPhone = messageEntry.clientPhone;
    const message = 'Realizar yape o plin al número 987654321 a nombre de La Plata y subir el comprobante de pago';
    const template = this.builderTemplate.buildTextMessage(clientPhone,message);
    await this.senderService.sendMessages(template);
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
    ctx.step = STEPS.WAITING_CONFIRM_PAYMENT;
    await this.ctxService.updateCtx(ctx._id, ctx);
  }

  async notifyPaymentFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const clientPhone = messageEntry.clientPhone;
    const templateName:string = NAME_TEMPLATES.NOTIFY_PAYMENT;
    const languageCode = 'es';
    const headerImageUrl = ctx.imageVoucher ? ctx.imageVoucher : null;
    const bodyParameters = [ctx.clientName || 'NN',ctx.date, ctx.hourSelected, ctx.amount, ctx.clientName]
    const template = this.builderTemplate.buildTemplateMessage(clientPhone, templateName ,languageCode, headerImageUrl,bodyParameters);
    await this.senderService.sendMessages(template);
  }

  async confirmMessageFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const clientPhone = messageEntry.clientPhone;
    const message = 'Tu reserva ha sido confirmada';
    const template = this.builderTemplate.buildTextMessage(clientPhone,message);
    await this.senderService.sendMessages(template);
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
