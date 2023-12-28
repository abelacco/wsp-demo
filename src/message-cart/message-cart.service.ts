import { Injectable } from '@nestjs/common';
import { SenderService } from 'src/sender/sender.service';
import { Message } from './entities/message.entity';
import { BuilderTemplatesService } from 'src/builder-templates/builder-templates.service';
import { INTERACTIVE_REPLIES_TYPES, PAYMENTSTATUS, STEPS, WSP_MESSAGE_TYPES } from 'src/common/dto/constants';
import { MongoDbService } from './db/mongodb.service';
import { IMessageDao } from './db/messageDao';
import { IParsedMessage } from './entities/messageParsed';
import { WspReceivedMessageDto } from 'src/common/dto';


@Injectable()
export class MessageCartService {
  private readonly _db: IMessageDao;

  constructor(
    private readonly senderService: SenderService,
    private readonly builderTemplate: BuilderTemplatesService,
    private readonly _mongoDbService: MongoDbService,
  ) {
    this._db = this._mongoDbService;

  }

  async proccessMessage(entryMessage: WspReceivedMessageDto) {
    // Deestructuración del mensaje de entrada
    const parsedMessage = await this.messageDestructurer(entryMessage);
    //Si es otro tipo de mensaje 
    if(parsedMessage === 'OKNO') {
      return 'OK'
    }
    //Busca mensaje por número de cliente
    const currentMessage = await this.findOrCreateMessage(parsedMessage);
    // Resetea el step del mensaje
    parsedMessage.content === 'reset' ? currentMessage.step = 0 : null;
    // Se le suma 1 al step del mensaje
    currentMessage.step++;
    // Si el mensaje es el ultimo agregar el status de pago
    currentMessage.step === 11 ? currentMessage.status = PAYMENTSTATUS.ACCEPTED : null;
    // Se actualiza el mensaje en la base de datos con el step correspondiente
    const updateMessage = await this._db.updateMessage(currentMessage._id, currentMessage);
    // Se obtiene el template correspondiente al step actual
    const getTemplate = this.builderTemplate.buildMessageTemplate(updateMessage);
    // Se envia el mensaje al cliente
    if(getTemplate instanceof Array) {
      for (const message of getTemplate) {
        await this.senderService.sendMessages(message);
      }
    } else {
      await this.senderService.sendMessages(getTemplate);
    }
    return 'OK';
  }

  private async messageDestructurer(messageDto: WspReceivedMessageDto) {
    const parsedMessage: IParsedMessage = {
      clientName: '',
      clientPhone: '',
      type: '',
      content: {}
  }
  console.log( messageDto.entry[0].changes[0].value)
  if(messageDto.entry[0].changes[0].value?.statuses && messageDto.entry[0].changes[0].value?.statuses[0].status) {
      return 'OKNO'
  }
  const contact = messageDto.entry[0].changes[0].value.contacts[0];
  const message = messageDto.entry[0].changes[0].value.messages[0];

  parsedMessage.clientName = contact.profile.name;
  parsedMessage.clientPhone = contact.wa_id.startsWith('52') ? contact.wa_id.replace('521', '52') : contact.wa_id;
  parsedMessage.type = message.type;
  
  switch (message.type) {
    case WSP_MESSAGE_TYPES.INTERACTIVE:
      const interactiveType = message.interactive.type;
      if (interactiveType === INTERACTIVE_REPLIES_TYPES.BUTTON_REPLY) {
        parsedMessage.content = {
          title: message.interactive[INTERACTIVE_REPLIES_TYPES.BUTTON_REPLY].title,
          id: message.interactive[INTERACTIVE_REPLIES_TYPES.BUTTON_REPLY].id,
        };
        
        break;
      } else if (interactiveType === INTERACTIVE_REPLIES_TYPES.LIST_REPLY) {
        parsedMessage.content = {
          title: message.interactive[INTERACTIVE_REPLIES_TYPES.LIST_REPLY].title,
          id: message.interactive[INTERACTIVE_REPLIES_TYPES.LIST_REPLY].id,
          description: message.interactive[INTERACTIVE_REPLIES_TYPES.LIST_REPLY].description,
        };
      }
      break;
    case WSP_MESSAGE_TYPES.TEXT:
      parsedMessage.content = message.text.body;
      break;
    case WSP_MESSAGE_TYPES.IMAGE:
      parsedMessage.content = message.image.id
      break;
    default:
      return;
  }

  return parsedMessage;
  }

  private async findOrCreateMessage({ clientPhone }): Promise<Message> {
    //Busca mensaje por número de cliente
    const message = await this._db.findOrCreate(clientPhone);

    return message;
  }

}
