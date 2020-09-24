import {Bot} from './src/Bot';
import {Logger, LogLevel} from './src/Logger';
import {NvidiaUs} from './src/Crawler/NvidiaUs';
import {AmazonCom} from './src/Crawler/AmazonCom';
import {BestBuy} from './src/Crawler/BestBuy';
require('dotenv').config();

const bot = new Bot(process.env.DELAY as unknown as number, [
  new NvidiaUs(),
  new BestBuy(),
  new AmazonCom(),
], [
// ], new Logger(parseInt(process.env.DEBUG as unknown as string) === 1 ? LogLevel.Debug : LogLevel.Info));
], new Logger(LogLevel.Debug));

bot.start();
