import { Injectable } from '@nestjs/common';

import puppeteer from 'puppeteer';
import { Entity__Price_Response } from 'src/shared/entities/price_response';

@Injectable()
export class G2GService {
  async getPrices(region: string, faction: string, subserver: string) {
    const testURL = `https://www.g2g.com/categories/wow-gold?q=${subserver}%20%5B${region}%5D%20-%20${faction}`;

    const browser = await puppeteer.launch({
      headless: 'new',
    });

    const page = await browser.newPage();

    await page.goto(testURL, {
      waitUntil: 'networkidle0',
    });

    await page.waitForTimeout(6000);

    const buttonElement = await page.$(
      '.full-height.column.rounded-borders.cursor-pointer.g-card-no-deco.g-card-hover.g-border-light',
    );

    await buttonElement.click();

    await page.waitForNavigation();

    // Wait some time for everything to load
    await page.waitForTimeout(6000);

    // Scroll down a bit to the list of items
    await page.evaluate(() => {
      window.scrollBy(0, 700);
    });

    const arrOfElements = await page.$$(
      'div.other_offer-desk-main-box.other_offer-div-box',
    );

    const arrOfinnerHTMLs = [];
    const arrOfSellerNames = [];
    const arrOfDeliverySpeeds = [];
    const arrOfGoldInStock = [];
    const arrOfPrices = [];

    for (const el of arrOfElements) {
      const elInnerHTML = await el.evaluate((el) => el.innerHTML);
      arrOfinnerHTMLs.push(elInnerHTML);
    }

    // Extract inner values using page.evaluate()
    for (const innerHTMLFromArr of arrOfinnerHTMLs) {
      const result = await page.evaluate((elementInnerHTML1) => {
        const div = document.createElement('div');
        div.innerHTML = elementInnerHTML1;

        const sellerName =
          div.querySelector('.seller__name-detail')?.textContent || '';

        let deliverySpeed = div.querySelectorAll(
          '.offer__content-lower-items span',
        )[0].textContent;

        if (deliverySpeed.includes('h')) {
          deliverySpeed = deliverySpeed.replace('h', ' hours');
        }
        //
        let goldInStock = div.querySelectorAll(
          '.offer__content-lower-items span',
        )[2].textContent;

        goldInStock = goldInStock.replace('K', ',000');

        let price = ` ${
          div.querySelector('.offer-price-amount').textContent || ''
        } ${
          div.querySelector('.offers_amount-currency-regional').textContent ||
          ''
        }`;

        let currency = '';

        if (price.includes('USD')) {
          currency = '$';
        }

        if (price.includes('EUR')) {
          currency = '€';
        }

        const extractPriceNumbers = () => {
          const regex = /\d+/g;
          const numbers = price.match(regex);
          return numbers;
        };

        price = `${currency}${extractPriceNumbers()}`;
        price = price.replace(',', '.');

        return { sellerName, deliverySpeed, goldInStock, price };
      }, innerHTMLFromArr);

      arrOfSellerNames.push(result.sellerName);
      arrOfDeliverySpeeds.push(result.deliverySpeed);
      arrOfGoldInStock.push(result.goldInStock);
      arrOfPrices.push(result.price);
    }

    await page.screenshot({
      path: 'screenshotg2g1.png',
    });

    await browser.close();

    const finalData = [];
    arrOfinnerHTMLs.forEach((element, i) => {
      finalData.push({
        sellerName: arrOfSellerNames[i],
        goldInStock: arrOfGoldInStock[i],
        pricePer10k: arrOfPrices[i],
        deliveryTime: arrOfDeliverySpeeds[i],
      });
    });

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
