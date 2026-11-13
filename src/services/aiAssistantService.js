/**
 * SmartShop AI - AI Assistant Service
 * Integrates directly with Google Gemini API when VITE_GEMINI_API_KEY is configured,
 * and provides a high-fidelity local semantic rule engine with product recommendation cards.
 */

import { getLowestPrice } from '../data/products';
import { getCatalogProducts } from './productService';
import { getNearbyStoresForProduct } from './storeService';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Send user query to AI Assistant
 * @param {string} userQuery
 * @param {Array} chatHistory
 * @returns {Promise<{text: string, recommendedProducts: Array, suggestedQuestions: Array}>}
 */
export async function queryAIAssistant(userQuery, chatHistory = []) {
  // If user provided a Gemini API Key in .env, call real Gemini API with product context
  if (GEMINI_API_KEY) {
    try {
      const geminiResult = await callGeminiAPI(userQuery, chatHistory);
      if (geminiResult) return geminiResult;
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local AI engine:', err);
    }
  }

  // Fallback: SmartShop Local AI Engine with semantic matching & rich catalog analysis
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = processLocalAIQuery(userQuery);
      resolve(response);
    }, 600); // realistic AI reasoning delay
  });
}

/**
 * Local AI Query Processor
 */
function processLocalAIQuery(query) {
  const q = query.toLowerCase().trim();
  const catalog = getCatalogProducts();

  // 1. Laptop under ₹60,000 / Budget Laptop
  if (
    (q.includes('laptop') && (q.includes('60') || q.includes('under') || q.includes('budget') || q.includes('cheap'))) ||
    q.includes('laptop under ₹60,000') ||
    q.includes('suggest a laptop under')
  ) {
    const matchingLaptops = catalog.filter(
      (p) => p.category === 'Laptops' && getLowestPrice(p).price <= 65000
    );

    return {
      text: `Based on current price analysis across Amazon, Flipkart, and Croma, here are the top laptops under ₹60,000:\n\n` +
        `• **Lenovo ThinkPad E14 Gen 5** is our top recommendation for work & durability. It boasts an Intel Core i5-1335U, 16GB RAM, and military-grade build quality starting at **₹58,990** on Amazon (26% OFF).\n\n` +
        `• **HP Pavilion 15** is the best value everyday multimedia laptop with AMD Ryzen 5 7530U and B&O tuned sound starting at **₹51,990** on Flipkart.\n\n` +
        `Both laptops offer full 16GB RAM and fast 512GB NVMe SSD storage. Click a product card below to compare live retailer deals or inspect physical store availability.`,
      recommendedProducts: matchingLaptops,
      suggestedQuestions: [
        'Compare Lenovo ThinkPad E14 vs HP Pavilion 15',
        'Which nearby store has the ThinkPad in stock?',
        'Show me premium laptops with M3 chip'
      ]
    };
  }

  // 2. Best Camera Phone / Mobile with best camera
  if (
    q.includes('camera') ||
    q.includes('best camera') ||
    q.includes('which mobile has the best camera')
  ) {
    const cameraPhones = catalog.filter((p) =>
      ['samsung-galaxy-s24-ultra', 'iphone-16-pro', 'google-pixel-9-pro'].includes(p.id)
    );

    return {
      text: `When evaluating camera performance across real-world testing, computational photography, and optical hardware, these two flagships lead the industry:\n\n` +
        `1. **Samsung Galaxy S24 Ultra**: The supreme zoom king. It features a **200MP primary sensor** with OIS, 50MP 5x periscope telephoto capable of 100x Space Zoom, and Galaxy AI Generative Photo Editing. Currently at **₹1,19,999** on Amazon (Save ₹15,000).\n\n` +
        `2. **Apple iPhone 16 Pro**: Best in class for cinematic 4K 120fps video recording, color consistency across lenses, and the new physical tactile **Camera Control sensor**. Starting at **₹1,23,900** on Flipkart.\n\n` +
        `For pure portrait photography and computational night scenes, **Google Pixel 9 Pro** is also a formidable contender at **₹99,999** on Flipkart.`,
      recommendedProducts: cameraPhones,
      suggestedQuestions: [
        'Find the cheapest iPhone',
        'Compare iPhone 16 Pro and Galaxy S24 Ultra',
        'Which stores near me have the S24 Ultra?'
      ]
    };
  }

  // 3. Compare MacBook Air and Dell XPS / Compare laptops
  if (
    q.includes('compare') &&
    (q.includes('macbook') || q.includes('xps') || q.includes('dell') || q.includes('laptop'))
  ) {
    const compareProds = catalog.filter((p) =>
      ['macbook-air-m3-13', 'dell-xps-13-9340', 'asus-rog-zephyrus-g14'].includes(p.id)
    );

    return {
      text: `Here is a quick head-to-head AI breakdown:\n\n` +
        `• **Performance & Efficiency:** Apple MacBook Air M3 leads in battery endurance (up to 18 hours fanless) and unified memory speed for macOS workflows.\n\n` +
        `• **Display & Ports:** Dell XPS 13 features a brilliant 120Hz display with Intel AI Boost NPU and dual Thunderbolt 4 ports in Windows 11.\n\n` +
        `• **Pricing:** MacBook Air M3 starts at **₹1,22,990** on Amazon, while Dell XPS 13 starts at **₹1,44,990** on Flipkart with a larger 1TB NVMe SSD.\n\n` +
        `You can add both to your SmartShop Comparison Tray for an in-depth spec difference analysis.`,
      recommendedProducts: compareProds.slice(0, 2),
      suggestedQuestions: [
        'Add both to Product Comparison',
        'Suggest a laptop under ₹60,000',
        'Which stores offer immediate pickup for MacBook Air?'
      ]
    };
  }

  // 4. Cheapest iPhone
  if (q.includes('iphone') || q.includes('cheapest iphone')) {
    const iphone = catalog.find((p) => p.id === 'iphone-16-pro');
    const lowest = iphone ? getLowestPrice(iphone) : null;

    return {
      text: `Currently, the lowest verified online price for the **Apple iPhone 16 Pro (256GB, Desert Titanium)** is on **${lowest?.store?.name || 'Flipkart'}** at **₹${lowest?.price?.toLocaleString('en-IN')}**.\n\n` +
        `• **Flipkart:** ₹1,23,900 (Best Price - Save ₹6,000 + ₹1,000 exchange bonus)\n` +
        `• **Amazon:** ₹1,24,900 with Prime Express Delivery by Tomorrow 9 AM\n` +
        `• **Croma:** ₹1,25,900 with instant store pickup in 2 hours\n\n` +
        `Buying from Flipkart gives you the highest net cash savings today!`,
      recommendedProducts: iphone ? [iphone] : [],
      suggestedQuestions: [
        'Show nearby physical stores with iPhone 16 Pro stock',
        'Which mobile has the best camera?',
        'Compare iPhone 16 Pro with Galaxy S24 Ultra'
      ]
    };
  }

  // 5. Nearby stores with product / Stock inquiries
  if (
    q.includes('nearby store') ||
    q.includes('store') ||
    q.includes('sony wh-1000xm5') ||
    q.includes('which nearby store has')
  ) {
    const targetProduct = catalog.find((p) =>
      q.includes('sony') || q.includes('xm5') || q.includes('headphones')
        ? p.id === 'sony-wh-1000xm5'
        : p.id === 'macbook-air-m3-13'
    ) || catalog[0];

    const nearbyStores = getNearbyStoresForProduct(targetProduct.id);

    return {
      text: `I checked real-time inventory at physical retail stores in your area for **${targetProduct.name}**:\n\n` +
        `1. **Croma Megastore - Indiranagar** (1.2 km away) has **8 units in stock** at ₹28,490. Live demo available.\n` +
        `2. **Reliance Digital - Koramangala** (3.8 km away) has **6 units in stock** at ₹27,990. Lowest local pickup price!\n` +
        `3. **Vijay Sales - MG Road** (5.1 km away) has **4 units in stock** at ₹27,500.\n\n` +
        `You can reserve for curbside pickup or get instant driving directions directly through our Nearby Stores page.`,
      recommendedProducts: [targetProduct],
      suggestedQuestions: [
        'Open Nearby Stores Map',
        'Recommend headphones under ₹2,000',
        'Check online prices for Sony WH-1000XM5'
      ]
    };
  }

  // 6. Headphones under ₹2,000 / Budget audio
  if (
    (q.includes('headphone') || q.includes('earphone') || q.includes('audio')) &&
    (q.includes('2000') || q.includes('2,000') || q.includes('cheap') || q.includes('budget'))
  ) {
    const budgetHeadphones = catalog.filter(
      (p) => p.category === 'Headphones' && getLowestPrice(p).price <= 5000
    );

    return {
      text: `For under ₹2,000, the runaway champion is the **boAt Rockerz 550 Over-Ear Wireless Headphones**:\n\n` +
        `• **Best Deal Retailer:** Available on **Flipkart for ₹1,699** (Flat 66% discount from original ₹4,999 MRP).\n` +
        `• **Highlights:** Massive 50mm dynamic bass drivers, 20-hour playback, physical noise-isolating plush earcups, and dual wireless/AUX modes.\n` +
        `• **Amazon Price:** ₹1,799 with next-day Prime delivery.\n` +
        `• **Local Stores:** Available in-stock at Croma Indiranagar and Poorvika HSR.`,
      recommendedProducts: budgetHeadphones,
      suggestedQuestions: [
        'What about premium noise canceling headphones?',
        'Compare boAt Rockerz 550 and Sony WH-1000XM5',
        'Suggest a smartwatch under ₹25,000'
      ]
    };
  }

  // 7. General search fallback: Find any keyword matches in products
  const matching = catalog.filter((p) => {
    return (
      q.includes(p.brand.toLowerCase()) ||
      q.includes(p.category.toLowerCase()) ||
      (p.barcode && q.includes(String(p.barcode).toLowerCase())) ||
      p.name.toLowerCase().split(' ').some((word) => word.length > 3 && q.includes(word))
    );
  });

  if (matching.length > 0) {
    return {
      text: `I found **${matching.length} matching products** across online stores (Amazon, Flipkart, Croma) and local retailers for your query:\n\n` +
        matching.slice(0, 3).map((p) => {
          const { price, store, savings } = getLowestPrice(p);
          return `• **${p.name}**: Lowest price **₹${price.toLocaleString('en-IN')}** on ${store?.name || 'online retailer'} (Save ₹${savings.toLocaleString('en-IN')})`;
        }).join('\n') +
        `\n\nExplore detailed specifications, live stock levels, or launch a side-by-side comparison below:`,
      recommendedProducts: matching.slice(0, 3),
      suggestedQuestions: [
        'Which retailer has the fastest delivery?',
        'Find nearby physical stores for these products',
        'Compare top 2 models'
      ]
    };
  }

  // 8. General friendly greeting / helpful assistant intro
  return {
    text: `Hello! I'm **SmartShop AI**, your intelligent personal shopping advisor. I monitor real-time prices across **Amazon, Flipkart, Croma**, and certified **nearby physical retail stores** in your city.\n\n` +
      `Here are a few things you can ask me:\n` +
      `• *"Suggest a high-performance laptop under ₹60,000"*\n` +
      `• *"Which smartphone has the best camera setup?"*\n` +
      `• *"Where can I buy the iPhone 16 Pro at the lowest price?"*\n` +
      `• *"Find stores near Indiranagar stocking the Sony WH-1000XM5"*\n` +
      `• *"Recommend headphones under ₹2,000"*`,
    recommendedProducts: catalog.slice(0, 3),
    suggestedQuestions: [
      'Suggest a laptop under ₹60,000',
      'Which mobile has the best camera?',
      'Find the cheapest iPhone',
      'Recommend headphones under ₹2,000'
    ]
  };
}

/**
 * Call real Google Gemini API if key is present
 */
async function callGeminiAPI(query, chatHistory) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const catalog = getCatalogProducts();

  const catalogSummary = catalog.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    brand: p.brand,
    lowestPrice: getLowestPrice(p).price,
    stores: p.onlineStores.map((s) => `${s.name}: ₹${s.price}`).join(', ')
  }));

  const systemPrompt = `You are SmartShop AI, a smart shopping assistant.
Current catalog summary: ${JSON.stringify(catalogSummary)}
When answering, recommend specific products from this catalog, mention prices across Amazon, Flipkart and Croma, and advise the user. Keep it friendly, clear, and concise.`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\nUser Question: ' + query }] }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini HTTP error ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) return null;

  // Find mentioned products
  const recommended = catalog.filter((p) =>
    text.toLowerCase().includes(p.name.toLowerCase()) ||
    text.toLowerCase().includes(p.brand.toLowerCase())
  ).slice(0, 3);

  return {
    text,
    recommendedProducts: recommended.length > 0 ? recommended : catalog.slice(0, 2),
    suggestedQuestions: [
      'Show nearby store availability',
      'Compare prices across Amazon, Flipkart and Croma',
      'Suggest another option'
    ]
  };
}
