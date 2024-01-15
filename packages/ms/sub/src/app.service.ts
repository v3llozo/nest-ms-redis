import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private data: string[] = [];
  getHello(): string {
    return 'Hello World!';
  }

  getData(): string[] {
    return this.data;
  }

  push(value: string): void {
    this.data.push(value);
  }
}
