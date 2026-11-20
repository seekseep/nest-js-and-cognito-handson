import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('greeting', () => {
    it('should return a greeting with the name', () => {
      expect(appController.getGreeting('NestJS')).toEqual({
        message: 'Hello, NestJS!',
      });
    });
  });
});
