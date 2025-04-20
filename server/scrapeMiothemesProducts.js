import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import Product from './models/Product.js'; // Adjust path if needed
import dotenv from 'dotenv';

dotenv.config();

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= document.body.scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}

async function scrapeMiothemesProducts() {
    try {
      // ✅ Connect to MongoDB
      await mongoose.connect(process.env.MONGO_URI);
  
      console.log('✅ Connected to MongoDB');
  
      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();
      await page.goto('https://www.templatemonster.com/authors/miothemes/#author-all-products', {
        waitUntil: 'networkidle2',
      });
  
      // 🌀 Scroll to load all products
      await autoScroll(page);
  
      // 🟡 Wait for actual product card
      await page.waitForSelector('article.product', { timeout: 20000 });
  
      // 📦 Extract products
      const products = await page.$$eval('article.product', (cards) =>
        cards.map((card) => {
          const title = card.querySelector('.product-name-title-text')?.innerText.trim();
          const url = card.querySelector('a.product-grid-main-link')?.href;
          const img = card.querySelector('img.product-image')?.src;
          const price = card.querySelector('.product-price_discount')?.innerText.trim() ||
                        card.querySelector('.product-price_regular')?.innerText.trim();
  
          // Check if price exists, clean it and convert to number
          const numericPrice = price ? parseFloat(price.replace('$', '').trim()) : 0;
  
          return { 
            title, 
            url, 
            img, 
            price: numericPrice, // Store as a number (or null if price is missing)
            description: '', // You can add description scraping here if available
          };
        })
      );
  
      if (!products.length) {
        console.log('❌ No products found to scrape!');
      } else {
        console.log(`✅ Scraped ${products.length} products`);
  
        // Optional: Save to MongoDB
        await Product.insertMany(products);
        console.log('✅ Products saved to database');
      }
  
      await browser.close();
      mongoose.connection.close();
    } catch (error) {
      console.error('❌ Error scraping products:', error);
    }
  }
  

scrapeMiothemesProducts();
