import {CrawlerInterface} from './CrawlerInterface';
import cheerio from 'cheerio';
import axios from 'axios';
import {Product} from '../Model/Product';
import {Logger} from '../Logger';

// interface UrlFailerCounter {
//   url: string;
//   count: number;
// }

export class AmazonCom implements CrawlerInterface {
  private readonly urls = [
    'https://amzn.to/3iSqIrK',
    'https://amzn.to/32PmV8W',
    'https://amzn.to/3mFsU8a',
    'https://amzn.to/2RVxlNP',
    'https://amzn.to/3mLMn75',
    'https://amzn.to/3hT288N',
    'https://amzn.to/3mGxQJX',
    'https://amzn.to/3kFZ1CY',
    'https://amzn.to/2ROJgx1',
    'https://amzn.to/2HrvSgB',
    'https://amzn.to/3ckC3ON',
    'https://amzn.to/32QiAlM',
    'https://amzn.to/2He0YYH',
    'https://amzn.to/33UDAqO'
  ];

  // private urlFailers: UrlFailerCounter[] = [];

  getRetailerName(): string {
    return 'amazon.com';
  }

  async acquireStock(logger: Logger) {
    logger.debug(`acquireStock`);
    const products: Product[] = [];
    for await (const url of this.urls) {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36\'',
          }
        });
        const $        = cheerio.load(response.data);
        const name     = $('#productTitle').first().text().trim();
        const stock    = $('#availability span').first().text().trim();
        if (name === '') {
          continue;
        }
        products.push({
          name,
          url,
          stock,
          affiliate: true
        });
        logger.debug(`Acquired stock from ${this.getRetailerName()}`, products[products.length - 1]);
      } catch (e) {
        logger.error(`${this.getRetailerName()}: ` + e.message, {url});
      }
    }
    return products;
  }
}
