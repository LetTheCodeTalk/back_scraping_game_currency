import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OvergearModule } from './overgear/overgear.module';
import { G2GModule } from './G2G/G2G.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [OvergearModule, G2GModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
