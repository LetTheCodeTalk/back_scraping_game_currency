import { Module } from '@nestjs/common';
import { G2GService } from './G2G.service';
import { G2GController } from './G2G.controller';

@Module({
  controllers: [G2GController],
  providers: [G2GService],
})
export class G2GModule {}
