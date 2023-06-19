import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { SharedController } from './shared.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entity__Price_Response } from './entities/price_response';

@Module({
  // Create entities on the db
  // imports: [TypeOrmModule.forFeature([Entity__Price_Response])],
  controllers: [SharedController],
  providers: [SharedService],
})
export class SharedModule {}
