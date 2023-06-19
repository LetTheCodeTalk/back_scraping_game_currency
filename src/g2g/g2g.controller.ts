import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { G2GService } from './G2G.service';

@Controller('g2g')
export class G2GController {
  constructor(private readonly g2gService: G2GService) {}

  @Get('prices/:region/:faction/:subserver')
  getPrices(
    @Param('region') region: string,
    @Param('faction') faction: string,
    @Param('subserver') subserver: string,
  ) {
    return this.g2gService.getPrices(region, faction, subserver);
  }
}
