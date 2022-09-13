import { ConfigCustomService } from '@/config/config.service';
import { User } from '@/user/user.schema';
import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigCustomService,
  ) {}
  private readonly logger = new Logger(SearchService.name);

  public async createIndex() {
    try {
      const index = this.configService.elasticSearchConfig().index;

      const checkIndex = await this.esService.indices.exists({ index });

      if (checkIndex.statusCode === 404) {
        this.esService.indices.create(
          {
            index,
            body: {
              mappings: {
                properties: {
                  user_name: {
                    type: 'text',
                    fields: {
                      keyword: {
                        type: 'keyword',
                        ignore_above: 256,
                      },
                    },
                  },
                  user_email: {
                    type: 'text',
                    fields: {
                      keyword: {
                        type: 'keyword',
                        ignore_above: 256,
                      },
                    },
                  },
                },
              },
              settings: {
                analysis: {
                  filter: {
                    autocomplete_filter: {
                      type: 'edge_ngram',
                      min_gram: 1,
                      max_gram: 20,
                    },
                  },
                  analyzer: {
                    autocomplete: {
                      type: 'custom',
                      tokenizer: 'standard',
                      filter: ['lowercase', 'autocomplete_filter'],
                    },
                  },
                },
              },
            },
          },
          (err: any) => {
            if (err) {
              this.logger.error(err);
            }
          },
        );
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  public async indexUser(user: any) {
    return await this.esService.index({
      index: this.configService.elasticSearchConfig().index,
      body: user,
    });
  }

  public async searchUser(text: string) {
    console.log(this.configService.elasticSearchConfig().index);

    try {
      return await this.esService.search({
        index: this.configService.elasticSearchConfig().index,
        body: {
          query: {
            match_all: {},
          },
          size: 100,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
}
