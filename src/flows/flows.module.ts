import { Module } from '@nestjs/common';
import { FlowsService } from './flows.service';
import { FlowsController } from './flows.controller';
import { BuilderTemplatesModule } from 'src/builder-templates/builder-templates.module';
import { UserModule } from 'src/user/user.module';
import { GeneralServicesModule } from 'src/general-services/general-services.module';

@Module({
  controllers: [FlowsController],
  providers: [FlowsService],
  exports: [FlowsService],
  imports: [BuilderTemplatesModule , UserModule, GeneralServicesModule]
})
export class FlowsModule {}
