import { Module } from '@nestjs/common';
import { WspWebHookService } from './wsp-web-hook.service';
import { WspWebHookController } from './wsp-web-hook.controller';
import { MessageCartModule } from 'src/message-cart/message-cart.module';


@Module({
  imports: [MessageCartModule],
  controllers: [WspWebHookController],
  providers: [WspWebHookService],


})
export class WspWebHookModule {}
