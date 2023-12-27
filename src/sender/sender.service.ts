import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SenderService {
  async sendMessages(messageClient: any) {
    console.log('enviando mensaje, body: ', messageClient);
    try {
      const prueba = await axios.post(
        `https://graph.facebook.com/v18.0/${process.env.PHONE_ID}/messages`, messageClient,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.CURRENT_ACCESS_TOKEN}`,
          },
        },
      );
      console.log('prueba', prueba.status);

    } catch (error) {
      console.log(error.response.data.error.message);
      throw new Error(error.response.data.error.message);
    }
  }
}
