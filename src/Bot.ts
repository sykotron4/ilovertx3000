import {CrawlerInterface} from './Crawler/CrawlerInterface';
import {Product} from './Model/Product';
import {Logger} from './Logger';
import {NotificationInterface} from './Notification/NotificationInterface';

export class Bot {
  private stock: Product[] = [];

  constructor(
    private readonly delay: number,
    private readonly crawlers: CrawlerInterface[],
    private readonly notifications: NotificationInterface[],
    private readonly logger: Logger
  ) {
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
  }

  async start() {
    this.logger.info(`Starting ilovertx3000 with ${this.crawlers.length} crawlers: ${this.crawlers.map(c => c.constructor.name).join(', ')}`);

    if (this.crawlers.length === 0) {
      this.logger.info('Nothing to do here...');
      return;
    }

    // noinspection InfiniteLoopJS
    while (true) {
      for await (const crawler of this.crawlers) {
        const stock = await crawler.acquireStock(this.logger);
        stock.forEach(product => {
          const existing = this.stock.find(p => p.retailer === product.retailer && p.name === product.name);
          if (!existing) {
            this.stock.push({...product});
            return;
          }
          if (product.stock !== existing.stock) {
            this.handleStockChange(product, existing);
            existing.stock = product.stock;
          }
        });
      }
      await this.sleep(this.delay);
    }
  }

  private handleStockChange(product: Product, previous: Product) {
    this.notifications.forEach(notification => {
      const prev      = previous.stock?.trim();
      const current   = product.stock?.trim();
      const affiliate = product.affiliate ? ' [A]' : '';
      notification.notify(
        `${product.retailer}: Stock changed from "${prev !== '' ? prev : 'unknown'}" to "${current !== '' ? current : 'unknown'}". ${product.url}${affiliate}`,
        this.logger
      );
    }
  );
    }

    private async sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
