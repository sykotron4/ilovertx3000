import {CrawlerInterface} from './CrawlerInterface';
import cheerio from 'cheerio';
import {Product} from '../Model/Product';
import {Logger} from '../Logger';
import axios from 'axios';

export class Evga implements CrawlerInterface {
  private readonly url = 'https://www.evga.com/products/ProductList.aspx?type=10&family=Power+Supplies&chipset=1600+Watts';

  getRetailerName(): string {
    return 'EVGA Shop';
  }

  async acquireStock(logger: Logger) {
    const products: Product[] = [];
    try {
      const response = await axios.get(this.url);
      const $ = cheerio.load(response.data);
      $('.list-item').each((i, element) => {
        const name = $(element).find('.pl-list-pname').text().trim();
        const url  = $(element).find('a').first().attr('href');
        const stock = $(element).find('.btnBigAddCart').length ? 'available' : 'Out of Stock';
        if (name === '' || !url) {
          return;
        }
        products.push({
          name,
          url: `https://www.evga.com${url}`,
          stock
        });
        logger.debug(`Acquired stock from ${this.getRetailerName()}`, products[products.length - 1]);
      });
    } catch (e) {
      logger.error(e.message, { url: this.url });
    }
    return products;
  }
}
