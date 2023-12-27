import { Test, TestingModule } from '@nestjs/testing';
import { MessageCartService } from './message-cart.service';

describe('MessageCartService', () => {
  let service: MessageCartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageCartService],
    }).compile();

    service = module.get<MessageCartService>(MessageCartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
