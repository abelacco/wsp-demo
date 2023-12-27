import { Injectable } from '@nestjs/common';
import { WspQueriesDto } from './dto';
import { WspReceivedMessageDto } from 'src/common/dto';
import { MessageCartService } from 'src/message-cart/message-cart.service';


@Injectable()
export class WspWebHookService {
  constructor(
    private readonly msgService: MessageCartService,
  ) {}

 // Este metodo debe servir como handler de los mensajes que llegan desde WhatsApp
 async proccessMessage(messageWSP: WspReceivedMessageDto) {
  const processMessage = await this.msgService.proccessMessage(messageWSP);
  // Logger.log('Iniciando proceso de mensaje', 'WSP INIT');
  // // Deberia queda 3 pasos
  // // paso 1 deestructurar el mensaje
  // const parsedMessage = await messageDestructurer(messageWSP);
  // // paso 2 enviar el mensaje al servicio de mensajeria
  // const response = await this.msgService.messageFlowHandler( parsedMessage);
  // // paso 3 enviar la respuesta al cliente
  // // Logger.log(messageWSP.entry[0].changes[0].value, 'RAW MESSAGE');
  // Logger.log('Respuesta del bot')
  // if (!response) {
  //   return false;
  // }
  // //Enviar respuesta a cliente 
  // for (const message of response) {
  //   await this.sendMessages(message);
  // }

  return 'OK';
}

validateWebHook(wspQueries: WspQueriesDto) {
  const myVerifyToken = process.env.MY_VERIFY_TOKEN;
  const hubMode = wspQueries['hub.mode'];
  const challenge = wspQueries['hub.challenge'];
  const verifyToken = wspQueries['hub.verify_token'];

  if (hubMode === 'subscribe' && verifyToken === myVerifyToken) {
    return challenge;
  } else {
    throw new Error(
      'Failed validation. Make sure the validation tokens match.',
    );
  }
}
}
