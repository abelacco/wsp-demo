import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WspWebHookModule } from './wsp-web-hook/wsp-web-hook.module';
import { SenderModule } from './sender/sender.module';
import { MessageCartModule } from './message-cart/message-cart.module';
import { BuilderTemplatesModule } from './builder-templates/builder-templates.module';
import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    WspWebHookModule, SenderModule, MessageCartModule, BuilderTemplatesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
