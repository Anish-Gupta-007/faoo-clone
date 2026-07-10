const express = require('express');
const router = express.Router();
const { getBlogs, getBlogByHandle } = require('../../services/shopify/blogs');

function parseMetaobject(node) {
  if (!node) return null;
  const parsed = {
    handle: node.handle,
    type: node.type
  };
  
  if (node.fields) {
    for (const field of node.fields) {
      if (field.reference) {
        parsed[field.key] = (field.reference.image && field.reference.image.url) || field.reference.url || null;
      } else {
        parsed[field.key] = field.value;
      }
    }
  }
  return parsed;
}

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const blogs = await getBlogs(limit);
    const parsedBlogs = blogs.map(parseMetaobject);
    res.json({ success: true, data: parsedBlogs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:handle', async (req, res) => {
  try {
    const blog = await getBlogByHandle(req.params.handle);
    const parsedBlog = parseMetaobject(blog);
    res.json({ success: true, data: parsedBlog });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
