import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OvergearModule } from './overgear/overgear.module';

@Module({
  imports: [OvergearModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
