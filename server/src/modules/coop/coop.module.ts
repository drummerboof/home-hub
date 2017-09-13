import { Module } from '@nestjs/common';
import { CoopClient } from './services/coop-client';
import { CoopGateway } from './coop.gateway';
import * as config from 'config';

@Module({
  components: [
    CoopClient,
    CoopGateway,
    {
      provide: 'coopConfig',
      useFactory: () => config.get('api.coop')
    }
  ]
})
export class CoopModule {}
