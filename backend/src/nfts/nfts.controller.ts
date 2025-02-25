import { Body, Controller, Post, Put, Param } from '@nestjs/common';
import { CreateNFTDto, UpdateNFTDto } from './nft.dto';
import { NFTsService } from './nfts.service';

@Controller('nfts')
export class NFTsController {
  constructor(private readonly nftsService: NFTsService) {}

  @Post()
  create(@Body() createNFTDto: CreateNFTDto) {
    return this.nftsService.create(createNFTDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateNFTDto: UpdateNFTDto) {
    return this.nftsService.update(id, updateNFTDto);
  }
}
