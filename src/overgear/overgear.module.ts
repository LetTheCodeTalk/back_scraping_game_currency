import { Module } from '@nestjs/common';
import { OvergearService } from './overgear.service';
import { OvergearController } from './overgear.controller';

@Module({
  controllers: [OvergearController],
  providers: [OvergearService],
})
export class OvergearModule {}
