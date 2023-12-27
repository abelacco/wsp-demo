import { Module } from '@nestjs/common';
import { MessageCartService } from './message-cart.service';
import { MessageCartController } from './message-cart.controller';
import { SenderService } from 'src/sender/sender.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './entities/message.entity';
import { BuilderTemplatesService } from 'src/builder-templates/builder-templates.service';
import { MongoDbService } from './db/mongodb.service';
import { SenderModule } from 'src/sender/sender.module';
import { BuilderTemplatesModule } from 'src/builder-templates/builder-templates.module';

@Module({
  controllers: [MessageCartController],
  providers: [MessageCartService, MongoDbService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
    SenderModule,
    BuilderTemplatesModule
    ],
  exports: [MessageCartService],
})
export class MessageCartModule {}
