import express from 'express';
import Blog from '../models/Blog.js';

const router = express.Router();

// GET /api/blogs
// List blogs (read-only). Populates author (username, email) when available.
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'username email' })
      .select('title slug author createdAt updatedAt')
      .lean()
      .exec();

    const result = blogs.map((b) => ({
      id: b._id,
      _id: b._id,
      title: b.title,
      slug: b.slug,
      author: b.author ? { id: b.author._id, username: b.author.username, email: b.author.email } : null,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }));

    return res.json({ data: result, blogs: result, count: result.length });
  } catch (err) {
    return res.status(500).json({ error: 'failed to list blogs', details: err.message });
  }
});

// GET /api/blogs/:slug
// Return blog detail by slug (read-only)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ error: 'slug required' });

    const blog = await Blog.findOne({ slug })
      .populate({ path: 'author', select: 'username email' })
      .lean()
      .exec();

    if (!blog) return res.status(404).json({ error: 'blog not found' });

    const result = {
      id: blog._id,
      _id: blog._id,
      title: blog.title,
      slug: blog.slug,
      body: blog.body,
      author: blog.author ? { id: blog.author._id, username: blog.author.username, email: blog.author.email } : null,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };

    return res.json({ data: result, blog: result });
  } catch (err) {
    return res.status(500).json({ error: 'failed to load blog', details: err.message });
  }
});

export default router;
