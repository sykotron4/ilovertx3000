import { CrawlerInterface } from "./CrawlerInterface";
import cheerio from "cheerio";
import { Product } from "../Model/Product";
import { Logger } from "../Logger";
import fetch, { Headers, RequestInit } from "node-fetch";

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append(
  "Cookie",
  "UID=7a54cfa6-8a6c-4eb4-be50-c368310cddff; pst2=138|N; physical_dma=807; customerZipCode=94564|N; ltc=%20; oid=1689626961; vt=e557d8c3-fbea-11ea-b025-06c47da51b43; globalUserTransition=cba; _abck=9F46B5EF61B70B12B56237F5A53F679B~-1~YAAQ5jLFF5gefVN0AQAA47XxrwT1d3HEXBAzXJc7MTmgK7OdO8UNo1GjK9VzzZ9OiJvZBt9whjzE1AT4lrO1lprJZ4Lj3T4p0C2JhUWeR/zB+un+Gqv/DgMnEH918zd5zJPImvVYoMXEs8B2Hhp0QSbdmKEkBoXRuWzff7TS1RwJUtCjB4jFxp/CYrMTnj1I1VPK03pPDiGNMGeLzrjRerdeosk0ELh8fpEgBRgLfK8h3DS8bLomxW3UZRH5qkaVvKEoybugaMWMbjMIM9ka9CA73t3tEC8pXUOU3tp1ll+hEczI9rndw7RO9g==~-1~-1~-1; bm_sz=47C11768BDB91826CA66B017D7044BA0~YAAQ5jLFF5cefVN0AQAA47XxrwkBBbpcxblPkqkm75B5HucdJRnDcY3e2icogy72SGx0MidZrqxZ31wlyu8X3s6NJn9PdNFAi8hIGJJUtdlPuK1bF3YS68w46iNuxrst1oqDIbE+ugx8AgT1q9BaqOCpYZ1hMYelXQLXNdBN9G10IetpkQH4YOPfTQCvkXA5ig==; bby_rdp=l; bby_cbc_lb=p-browse-w; CTT=56ed45e3f53c6d5cc8e101f4b84bb4ed; SID=c2d53b25-41a5-4d4c-8685-69473f5c8ca0"
);
myHeaders.append("Accept-Encoding", "gzip, deflate, br");
myHeaders.append("User-Agent", "PostmanRuntime/7.26.5");
myHeaders.append("referer", "https://google.com");

var requestOptions: RequestInit = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

export class BestBuy implements CrawlerInterface {
  private products: Product[] = [
    {
      name: "nVidia GeForce RTX 3080 FE",
      url: "https://bestbuy.com/site/6429440.p",
    },
    {
      name: "EVGA GeForce RTX 3080 XC3 ULTRA",
      url: "https://bestbuy.com/site/6432400.p",
    },
    {
      name: "EVGA GeForce RTX 3080 XC3 BLACK",
      url: "https://bestbuy.com/site/6432399.p",
    },
    {
      name: "MSI - Geforce RTX 3080 VENTUS 3X",
      url: "https://bestbuy.com/site/6430175.p",
    },

    {
      name: "MSI - Geforce RTX 3080 VENTUS 3X",
      url: "http://www.google.com/",
    },
  ];

  getRetailerName(): string {
    return "BestBuy";
  }

  async acquireStock(logger: Logger) {
    const products: Product[] = [];
    for await (const product of this.products) {
      try {
        const response = await fetch(
          "https://www.bestbuy.com/site/evga-geforce-rtx-3080-10gb-gddr6x-pci-express-4-0-graphics-card/6432400.p?skuId=6432400",
          requestOptions
        );
        if (!response.ok) {
          logger.warning("BestBuy Unavailable", { status: response.status });
          continue;
        }
        const text = await response.text();
        const $ = cheerio.load(text);
        product.retailer = this.getRetailerName();
        product.stock = $(".add-to-cart-button").first().text().trim();
        logger.debug(`Acquired stock from ${this.getRetailerName()}`, product);
        products.push(product);
      } catch (e) {
        logger.error(`${this.getRetailerName()}: ` + e.message, { url: product.url });
      }
    }
    logger.debug("Bestbuy Products:", products);
    return products;
  }
}