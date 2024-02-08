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
