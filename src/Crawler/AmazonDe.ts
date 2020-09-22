import {CrawlerInterface} from './CrawlerInterface';
import cheerio from 'cheerio';
import axios from 'axios';
import {Product} from '../Model/Product';
import {Logger} from '../Logger';

export class AmazonDe implements CrawlerInterface {
  private readonly urls = [
    'https://amzn.to/3mFTSMR',
    'https://amzn.to/3hNUGf2',
    'https://amzn.to/32SP3bl',
    'https://amzn.to/2ZYLyOI',
    'https://amzn.to/3ckCc4A',
    'https://amzn.to/3ctHefq',
    'https://amzn.to/3644xeF',
    'https://amzn.to/3kHrAzE',
    'https://amzn.to/3mI4UBl',
    'https://amzn.to/35XGgGN',
    'https://amzn.to/35Yfbn6',
    'https://amzn.to/32QmUla',
    'https://amzn.to/2FWjWCK',
    // Playstation 5
    'https://amzn.to/3mLwuNW'
  ];

  getRetailerName(): string {
    return 'amazon.de';
  }

  async acquireStock(logger: Logger) {
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
        logger.error(e.message, {url});
      }
    }
    return products;
  }
}
