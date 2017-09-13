import { Module } from '@nestjs/common';
import { CoopModule } from './coop/coop.module';

@Module({
  modules: [CoopModule]
})
export class ApplicationModule {
  static PREFIX = 'api';
}
