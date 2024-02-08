import { Injectable } from '@nestjs/common';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';
import { BuilderTemplatesService } from 'src/builder-templates/builder-templates.service';
import { IParsedMessage } from 'src/message-cart/interface';
import { BTN_OPT_CONFIRM_DNI, BTN_OPT_CONFIRM_GENERAL, BTN_OPT_PAYMENT, MENU, NAME_TEMPLATES, PACK } from 'src/message-cart/helpers/constants';
import { Message } from 'src/message-cart/entities/message.entity';
import { MULTIMEDIA_TYPES } from 'src/common/constants';
import { UserService } from 'src/user/user.service';
import { GeneralServicesService } from 'src/general-services/general-services.service';
import axios from 'axios';

@Injectable()
export class FlowsService {

  constructor(
    private readonly builderTemplate: BuilderTemplatesService,
    private readonly userService: UserService,
    private readonly generalService: GeneralServicesService,
  ) {
    // this.initFlow();
  }
  async initFlow(ctx:Message ,messageEntry: IParsedMessage) {
    // aca debo llamar al flow para registar al cliente , si es nuevo o si ya existe
    const client = await this.userService.findOrCreateClient({phone:messageEntry.clientPhone, name:messageEntry.clientName});
    const answers = []
    const clientPhone = messageEntry.clientPhone;
    const message1 = `Hola ${client.name}, soy el asistente virtual de Diana Otero`;
    const message2 = 'Dando click en el boton de Menú podrás ver las opciones que tengo para ti';
    const template1 = this.builderTemplate.buildTextMessage(clientPhone,message1);
    answers.push(template1);
    const template2 = this.builderTemplate.buildInteractiveListMessage(clientPhone,'Ver menú 🔎' , MENU , null ,message2 ,null);
    answers.push(template2);
    // actualizar message-cart
    return answers;
  }

  async askDniFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const answers = []
    const clientPhone = messageEntry.clientPhone;
    const message = '¡Genial! Para continuar con tu compra, ingresa tu DNI para registrarte ✅';
    const template = this.builderTemplate.buildTextMessage(clientPhone,message);
    answers.push(template);
    // actualizar message-cart
    return answers;
  }

  async retryAskDniFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const answers = []
    const clientPhone = messageEntry.clientPhone;
    const message = 'Vuelve a intentar con tu DNI';
    const template = this.builderTemplate.buildTextMessage(clientPhone,message);
    answers.push(template);
    // actualizar message-cart
    return answers;
  }

  async confirmDniFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const answers = []
    // call dni service
    const dniInfo = await this.generalService.findDocument(messageEntry.content);
    const fullname = `${dniInfo.nombres} ${dniInfo.apellidoPaterno} ${dniInfo.apellidoMaterno}`
    const clientPhone = messageEntry.clientPhone;
    const message = `¿Eres ${fullname}?`;
    const buttons = BTN_OPT_CONFIRM_DNI;
    const template =this.builderTemplate.buildInteractiveButtonMessage(clientPhone,message,buttons);
    answers.push(template);
    // actualizar message-cart
    return answers;
  }


  async servicesFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const answers = []
    const clientPhone = messageEntry.clientPhone;
    const message = 'Estos son nuestros planes nutricionales';
    const type = MULTIMEDIA_TYPES.DOCUMENT
    const templatePdf = this.builderTemplate.buildMultimediaMessage(clientPhone,'document' , {link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', caption: message , filename: 'planes_nutricionales.pdf'});
    answers.push(templatePdf);
    // const messageInfo = 'Tómate tu tiempo para revisar los planes nutricionales, cuando estés list@ para continuar, selecciona el botón de "Continuar"';
    // const templateInfo = this.builderTemplate.buildTextMessage(clientPhone,messageInfo);
    // answers.push(templateInfo);
    const confirmMessagebtn = 'Tómate tu tiempo para revisar los planes nutricionales, cuando estés list@ para continuar, selecciona el botón de "Continuar"';
    const confirmOptions = BTN_OPT_CONFIRM_GENERAL;
    const templateContinue = this.builderTemplate.buildInteractiveButtonMessage(clientPhone,confirmMessagebtn, confirmOptions);
    answers.push(templateContinue);

    // actualizar message-cart
    return answers;
  }
  //   answers.push(template);
  //   // actualizar message-cart
  //   return answers;
  // }

  async notifyPaymentFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const answers = []
    const clientPhone = messageEntry.clientPhone;
    const templateName:string = NAME_TEMPLATES.NOTIFY_PAYMENT;
    const languageCode = 'es';
    const headerImageUrl = 'https://res.cloudinary.com/dbq85fwfz/image/upload/v1707063439/chgtdb4pgtekpa8bxchf.jpg';
    const bodyParameters = ['SERGIO TALLEDO CORONADO','MI MEJOR VERSIÓN', 'INTERCAMBIOS' , '120', '51947308823',]
    const template = this.builderTemplate.buildTemplateMessage(clientPhone, templateName ,languageCode, headerImageUrl,bodyParameters);
    answers.push(template);
    // actualizar message-cart
    return answers;
  }

  async notifyNewConversationFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const answers = []
    const clientPhone = messageEntry.clientPhone;
    const templateName:string = NAME_TEMPLATES.NEW_CONVERSATION;
    const languageCode = 'es';
    const bodyParameters = ['51947308823',]
    const template = this.builderTemplate.buildTemplateMessage(clientPhone, templateName ,languageCode, null ,bodyParameters);
    answers.push(template);
    // actualizar message-cart
    return answers;
  }

  async confirmAppointmentFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const answers = []
    const clientPhone = messageEntry.clientPhone;
    const availableDate = '12/12/2021';
    const message = ` El cupo disponible más próximo es el ${availableDate}`;
    answers.push(this.builderTemplate.buildTextMessage(clientPhone,message));
    const bodyText = '¿Deseas continuar?';
    const buttons = BTN_OPT_CONFIRM_GENERAL;
    const template = this.builderTemplate.buildInteractiveButtonMessage(clientPhone,bodyText,buttons);
    answers.push(template);
    // actualizar message-cart
    return answers;
  }

  async choosePackFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const answers = []
    const clientPhone = messageEntry.clientPhone;
    const buttonText = 'Ver packs';
    const sections = PACK;
    const headerText = 'Elige el pack que más te convenga';
    const bodyText = 'Para escoger un pack, selecciona el botón de "Ver packs"';
    const template = this.builderTemplate.buildInteractiveListMessage(clientPhone,buttonText ,sections, headerText, bodyText ,null);
    answers.push(template);
    // actualizar message-cart
    return answers;
  }

  async choosePaymentFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const answers = []
    const clientPhone = messageEntry.clientPhone;
    const bodyText = 'Escoge el medio de pago que prefieras';
    const buttons = BTN_OPT_PAYMENT;
    const template = this.builderTemplate.buildInteractiveButtonMessage(clientPhone,bodyText,buttons);
    answers.push(template);
    // actualizar message-cart
    return answers;
  }

  async submitVoucherFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const answers = []
    const clientPhone = messageEntry.clientPhone;
    const message = '☝️ Para terminar, por favor realizar el yape al 997967943 a nombre de Diana Otero y enviar el boucher de pago en este chat ';
    const template = this.builderTemplate.buildTextMessage(clientPhone,message);
    answers.push(template);
    // const message2 = 'Una vez realizado el pago, envía el comprobante de pago para continuar con el proceso';
    // const template2 = this.builderTemplate.buildTextMessage(clientPhone,message2);
    // answers.push(template2);
    // actualizar message-cart
    return answers;
  }

  async waitingPaymentFlow(ctx:Message ,messageEntry: IParsedMessage) {
    const answers = []
    await this.getWhatsappMediaUrl({imageId: messageEntry.content});
    const clientPhone = messageEntry.clientPhone;
    const message = 'Estamos verificando tu comprobante de pago, esto tomará unos minutos por favor! 🙌';
    const template = this.builderTemplate.buildTextMessage(clientPhone,message);
    answers.push(template);
    // actualizar message-cart
    return answers;
  }

  async confirmationSaleFlow(ctx:Message ,messageEntry: IParsedMessage) {
    // Envia a cliente y usuario
    const answers = []
    const clientPhone = messageEntry.clientPhone;
    const message = '¡Genial! Tu compra ha sido confirmada';
    const template = this.builderTemplate.buildTextMessage(clientPhone,message);
    answers.push(template);
    // actualizar message-cart
    return answers;
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
