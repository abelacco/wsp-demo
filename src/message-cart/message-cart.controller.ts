import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageCartService } from './message-cart.service';


@Controller('message-cart')
export class MessageCartController {
  constructor(private readonly messageCartService: MessageCartService) {}


}
