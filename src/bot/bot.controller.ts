import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BotService } from './bot.service';


@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}


}