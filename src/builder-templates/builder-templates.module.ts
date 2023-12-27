import { Module } from '@nestjs/common';
import { BuilderTemplatesService } from './builder-templates.service';
import { BuilderTemplatesController } from './builder-templates.controller';

@Module({
  controllers: [BuilderTemplatesController],
  providers: [BuilderTemplatesService],
  exports: [BuilderTemplatesService],
})
export class BuilderTemplatesModule {}
