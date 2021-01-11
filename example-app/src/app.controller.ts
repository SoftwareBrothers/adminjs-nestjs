import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

import { AppService } from './app.service';

export class Hello {
  @Expose()
  @IsString()
  public hello!: string
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  public postHello(@Body() testBody: Hello): string {
    return testBody.hello;
  }
}
