import { Controller, Get, Param } from '@nestjs/common';
import { OvergearService } from './overgear.service';

@Controller('overgear')
export class OvergearController {
  constructor(private readonly overgearService: OvergearService) {}

  @Get('prices/:region/:faction/:subserver')
  getPrices(
    @Param('region') region: string,
    @Param('faction') faction: string,
    @Param('subserver') subserver: string,
  ) {
    return this.overgearService.getPrices(region, faction, subserver);
  }
}
