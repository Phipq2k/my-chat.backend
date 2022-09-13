import { ConfigOptionModule } from '@/config/config.module';
import { ConfigCustomService } from '@/config/config.service';
import { Module, OnModuleInit } from '@nestjs/common';
import {
  ElasticsearchModule,
  ElasticsearchService,
} from '@nestjs/elasticsearch';
import { SearchService } from './user-search.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigOptionModule],
      useFactory: async (configService: ConfigCustomService) => ({
        node: configService.elasticSearchConfig().node,
        maxRetries: 10,
        requestTimeout: 60000,
        pingTimeout: 60000,
        sniffOnStart: true,
      }),
      inject: [ConfigCustomService],
    }),
  ],
  controllers: [],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule implements OnModuleInit {
  constructor(private readonly searchService: SearchService) {}
  async onModuleInit() {
    await this.searchService.createIndex();
  }
}
