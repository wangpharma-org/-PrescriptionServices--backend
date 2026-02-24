import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo(): { message: string } {
    return {
      message:
        'This is the Prescription Service. It handles prescription management and related operations.',
    };
  }
}
