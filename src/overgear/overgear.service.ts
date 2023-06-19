import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { Entity__Price_Response } from 'src/shared/entities/price_response';

@Injectable()
export class OvergearService {
  async getPrices(region: string, faction: string, subserver: string) {
    const browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();

    await page.goto(
      `https://overgear.com/games/wow/gold?region=${region}&faction=${faction}&server=${subserver}-${region}`,
      {
        waitUntil: 'networkidle0',
      },
    );

    const arrOfElements = await page.$$('div.product__item');

    const arrOfTextContents = [];
    const arrOfGoldInStock = [];
    const arrOfPricesPer10k = [];
    const arrOfDeliveryTimes = [];
    const arrOfSellerNames = [];
    for (const el of arrOfElements) {
      const textContent = await el.evaluate((el) => el.textContent);

      // Get Text Content
      arrOfTextContents.push(textContent);

      // Get Seller Name
      const regexSellerName = /[^]*?(hours|minutes)(.*?)\s*(€|$)/i;
      const matchSellerName = textContent.match(regexSellerName);
      const resultSellerName = matchSellerName ? matchSellerName[2].trim() : '';
      arrOfSellerNames.push(resultSellerName);

      // Get Gold In Stock
      const regexGoldInStock = /-(?: EU| US)(.*?)\s/;
      const matchGoldInStock = textContent.match(regexGoldInStock);
      const resultGoldInStock = matchGoldInStock ? matchGoldInStock[1] : '';
      arrOfGoldInStock.push(resultGoldInStock);

      // Get Price
      const regexPricePer10k = /(?:€|\$)([\d.,]+)/;
      const matchPricePer10k = textContent.match(regexPricePer10k);
      const resultPricePer10k = matchPricePer10k ? matchPricePer10k[0] : '';
      arrOfPricesPer10k.push(resultPricePer10k);

      // Delivery Time
      const regexDeliveryTime =
        /Delivery time: (\d+) (minutes|hours).*?([€$]\d+(\.\d+)?)/;
      const matchDeliveryTime = textContent.match(regexDeliveryTime);

      const resultDeliveryTimeAmount = matchDeliveryTime
        ? matchDeliveryTime[1]
        : '';
      const resultDeliveryTimeUnit = matchDeliveryTime
        ? matchDeliveryTime[2]
        : '';

      arrOfDeliveryTimes.push(
        `${resultDeliveryTimeAmount} ${resultDeliveryTimeUnit}`,
      );
    }

    await browser.close();

    const finalData = [];
    arrOfTextContents.forEach((element, i) => {
      finalData.push({
        sellerName: arrOfSellerNames[i],
        goldInStock: arrOfGoldInStock[i],
        pricePer10k: arrOfPricesPer10k[i],
        deliveryTime: arrOfDeliveryTimes[i],
      });
    });

    // Filter possibly received wrong data
    finalData.filter((item: Entity__Price_Response) => {
      if (
        !item.deliveryTime ||
        !item.goldInStock ||
        !item.pricePer10k ||
        !item.sellerName
      ) {
        return null;
      }
      return item;
    });

    return finalData;
  }
}
