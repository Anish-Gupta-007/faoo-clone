const express = require('express');
const router = express.Router();
const { getProducts, getProductByHandle } = require('../../services/shopify/products');

function getStockStatus(variant) {
  if (!variant.availableForSale || variant.quantityAvailable === 0) {
    return 'out_of_stock';
  }
  if (variant.quantityAvailable <= 5) {
    return 'low_stock';
  }
  return 'in_stock';
}

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const products = await getProducts(limit);
    const processedProducts = products.map(product => {
      if (product.variants) {
        product.variants = product.variants.map(v => ({
          ...v,
          stockStatus: getStockStatus(v)
        }));
        product.isAvailable = product.variants.some(v => v.availableForSale);
      } else {
        product.isAvailable = false;
      }
      return product;
    });
    res.json({ success: true, data: processedProducts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

function parseMetafields(product) {
  if (!product) return product;

  let focusImages = [];
  let focusTitles = [];
  let irlImages = [];
  let irlHandles = [];
  let fitType = null;
  let usps = [];
  let sizeChartUrl = null;
  let sizeChart2Url = null;
  let supportsAllSizes = false;
  let modelInfo = '';
  let productVideo = null;

  const metafields = product.metafields || [];

  for (const mf of metafields) {
    if (!mf) continue;

    if (mf.key === 'model') {
      modelInfo = mf.value || '';
      continue;
    }

    if (mf.key === 'product_video') {
      if (mf.reference) {
        if (mf.reference.sources && mf.reference.sources.length > 0) {
          const mp4Source = mf.reference.sources.find(s => s.url.includes('.mp4'));
          productVideo = mp4Source ? mp4Source.url : mf.reference.sources[0].url;
        } else {
          productVideo = mf.reference.url || null;
        }
      } else if (mf.value) {
        productVideo = mf.value;
      }
      continue;
    }

    if (mf.key === 'supports_all_sizes') {
      supportsAllSizes = mf.value === 'true';
      continue;
    }

    if (mf.key === 'size_chart' || mf.key === 'size_chart2') {
      let url = null;
      if (mf.reference) {
        url = (mf.reference.image && mf.reference.image.url) || mf.reference.url || null;
      } else if (mf.references && mf.references.edges && mf.references.edges.length > 0) {
        const edge = mf.references.edges[0];
        const node = edge.node;
        url = (node.image && node.image.url) || node.url || null;
      }
      if (url) {
        if (mf.key === 'size_chart') sizeChartUrl = url;
        if (mf.key === 'size_chart2') sizeChart2Url = url;
      }
      continue;
    }

    if (mf.key === 'focus_with_faoo' || mf.key === 'irl_images') {
      if (mf.references && mf.references.edges && mf.references.edges.length > 0) {
        const urls = mf.references.edges.map(edge => {
          const node = edge.node;
          return (node.image && node.image.url) || node.url || null;
        }).filter(Boolean);
        if (mf.key === 'focus_with_faoo') focusImages = urls;
        if (mf.key === 'irl_images') irlImages = urls;
        continue;
      }
    }

    try {
      const parsed = JSON.parse(mf.value);
      if (mf.key === 'focus_with_faoo' && focusImages.length === 0) focusImages = parsed;
      if (mf.key === 'irl_images' && irlImages.length === 0) irlImages = parsed;
      if (mf.key === 'focus_titles') focusTitles = parsed;
      if (mf.key === 'irl_handles') irlHandles = parsed;
      if (mf.key === 'usp') usps = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      // Plain string metafields (e.g. fit_type) don't need JSON.parse
      if (mf.key === 'fit_type') fitType = (mf.value || '').toLowerCase().trim();
    }
  }

  delete product.metafields;
  product.focusImages = focusImages;
  product.focusTitles = focusTitles;
  product.irlImages = irlImages;
  product.irlHandles = irlHandles;
  if (fitType) product.fitType = fitType;
  product.usps = usps;
  product.sizeChartUrl = sizeChartUrl;
  product.sizeChart2Url = sizeChart2Url;
  product.supportsAllSizes = supportsAllSizes;
  product.modelInfo = modelInfo;
  product.productVideo = productVideo;

  return product;
}

router.get('/:handle', async (req, res) => {
  try {
    let product = await getProductByHandle(req.params.handle);
    product = parseMetafields(product);
    if (product) {
      if (product.variants) {
        product.variants = product.variants.map(v => ({
          ...v,
          stockStatus: getStockStatus(v)
        }));
        product.isAvailable = product.variants.some(v => v.availableForSale);
      } else {
        product.isAvailable = false;
      }
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
