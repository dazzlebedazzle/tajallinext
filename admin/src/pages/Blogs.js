import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { AuthContext } from '../components/auth';
import './Blogs.css';

const API = `${process.env.REACT_APP_API_URL}/api/blogs`;
const SITE_URL = (process.env.REACT_APP_SITE_URL || 'https://www.tajalli.co.in').replace(/\/$/, '');

const META_TITLE_MAX = 60;
const META_DESC_MAX = 160;

const emptyForm = {
  title: '',
  slug: '',
  desc: '',
  content: '',
  author: 'Tajalli',
  tags: '',
  imageAlt: '',
  metaTitle: '',
  metaDescription: '',
  status: 'draft',
};

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

const slugPreview = (text) =>
  String(text || '')
    .split('|')[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const errorMessage = (error) => error?.response?.data?.message || error?.message || 'Something went wrong';

const Blogs = () => {
  const { authState } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/admin/all`, { headers: authHeaders() });
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      setNotice(`Could not load posts: ${errorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState.isAuthenticated) fetchPosts();
  }, [authState.isAuthenticated]);

  // Revoke object URLs for picked images
  useEffect(() => () => {
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const visiblePosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((p) =>
      (filter === 'all' || p.status === filter) &&
      (!q || p.title.toLowerCase().includes(q) || (p.tags || []).some((t) => t.includes(q)))
    );
  }, [posts, filter, search]);

  const counts = useMemo(() => ({
    all: posts.length,
    published: posts.filter((p) => p.status === 'published').length,
    draft: posts.filter((p) => p.status === 'draft').length,
  }), [posts]);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setFormError('');
    setEditorOpen(true);
  };

  const openEdit = async (id) => {
    setFormError('');
    try {
      const { data } = await axios.get(`${API}/admin/${id}`, { headers: authHeaders() });
      setEditingId(id);
      setForm({
        title: data.title || '',
        slug: data.slug || '',
        desc: data.desc || '',
        content: (data.content || '').replace(/\\n/g, '\n'),
        author: data.author || '',
        tags: (data.tags || []).join(', '),
        imageAlt: data.imageAlt || '',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        status: data.status || 'published',
      });
      setImageFile(null);
      setImagePreview(data.image || '');
      setEditorOpen(true);
    } catch (error) {
      setNotice(`Could not open post: ${errorMessage(error)}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const save = async (status) => {
    setFormError('');
    if (!form.title.trim() || !form.desc.trim() || !form.content.trim() || !form.author.trim()) {
      setFormError('Title, short description, content and author are required.');
      return;
    }
    if (!editingId && !imageFile) {
      setFormError('Please choose a cover image.');
      return;
    }

    const payload = new FormData();
    Object.entries({ ...form, status }).forEach(([key, value]) => payload.append(key, value));
    if (imageFile) payload.append('image', imageFile);

    setSaving(true);
    try {
      const request = editingId
        ? axios.put(`${API}/updateBlog/${editingId}`, payload, { headers: authHeaders() })
        : axios.post(`${API}/createBlog`, payload, { headers: authHeaders() });
      const { data } = await request;
      setEditorOpen(false);
      setNotice(status === 'published' ? `Published “${data.title}”.` : `Saved “${data.title}” as draft.`);
      fetchPosts();
    } catch (error) {
      setFormError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (post) => {
    const status = post.status === 'published' ? 'draft' : 'published';
    try {
      await axios.put(`${API}/updateBlog/${post._id}`, { status }, { headers: authHeaders() });
      setNotice(status === 'published' ? `Published “${post.title}”.` : `Unpublished “${post.title}”.`);
      fetchPosts();
    } catch (error) {
      setNotice(`Could not update status: ${errorMessage(error)}`);
    }
  };

  const remove = async () => {
    const post = confirmDelete;
    setConfirmDelete(null);
    try {
      await axios.delete(`${API}/deleteBlog/${post._id}`, { headers: authHeaders() });
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
      setNotice(`Deleted “${post.title}”.`);
    } catch (error) {
      setNotice(`Could not delete: ${errorMessage(error)}`);
    }
  };

  if (authState.authLoading) return <Loader />;
  if (!authState.isAuthenticated) return <Navigate to="/login" />;

  const effectiveSlug = slugPreview(form.slug || form.title) || 'your-post-url';
  const seoTitle = form.metaTitle || form.title;
  const seoDesc = form.metaDescription || form.desc;

  return (
    <div>
      <Sidebar />
      <div className="blogs-container">
        <div className="blogs-header">
          <h2>Blog Management</h2>
          <button className="blogs-primary" onClick={openNew}>+ New post</button>
        </div>

        {notice && (
          <div className="blogs-notice" role="status">
            {notice}
            <button onClick={() => setNotice('')} aria-label="Dismiss">×</button>
          </div>
        )}

        <div className="blogs-toolbar">
          <div className="blogs-tabs" role="tablist">
            {['all', 'published', 'draft'].map((key) => (
              <button
                key={key}
                role="tab"
                aria-selected={filter === key}
                className={filter === key ? 'is-active' : ''}
                onClick={() => setFilter(key)}
              >
                {key === 'all' ? 'All' : key === 'published' ? 'Published' : 'Drafts'} ({counts[key]})
              </button>
            ))}
          </div>
          <input
            className="blogs-search"
            type="search"
            placeholder="Search title or tag"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <Loader />
        ) : visiblePosts.length === 0 ? (
          <div className="blogs-empty">
            {posts.length === 0 ? 'No blog posts yet. Create your first post.' : 'No posts match this filter.'}
          </div>
        ) : (
          <div className="blogs-list">
            {visiblePosts.map((post) => (
              <div className="blogs-item" key={post._id}>
                <img src={post.image} alt={post.imageAlt || post.title} />
                <div className="blogs-item__body">
                  <div className="blogs-item__top">
                    <span className={`blogs-badge blogs-badge--${post.status}`}>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <span className="blogs-item__date">
                      {post.status === 'published'
                        ? `Published ${formatDate(post.publishedAt || post.createdAt)}`
                        : `Updated ${formatDate(post.updatedAt)}`}
                    </span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.desc}</p>
                  {post.tags?.length > 0 && (
                    <div className="blogs-tags">
                      {post.tags.map((tag) => <span key={tag}>#{tag}</span>)}
                    </div>
                  )}
                </div>
                <div className="blogs-item__actions">
                  <button onClick={() => openEdit(post._id)}>Edit</button>
                  <button onClick={() => toggleStatus(post)}>
                    {post.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  {post.status === 'published' && (
                    <a href={`${SITE_URL}/blogs/${post.slug}`} target="_blank" rel="noreferrer">View</a>
                  )}
                  <button className="danger" onClick={() => setConfirmDelete(post)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editorOpen && (
        <div className="blogs-modal" role="dialog" aria-modal="true" aria-label={editingId ? 'Edit post' : 'New post'}>
          <div className="blogs-editor">
            <div className="blogs-editor__head">
              <h3>{editingId ? 'Edit post' : 'New post'}</h3>
              <button className="blogs-close" onClick={() => setEditorOpen(false)} aria-label="Close">×</button>
            </div>

            <div className="blogs-editor__grid">
              <div className="blogs-editor__main">
                <label>
                  Title *
                  <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. 5 Health Benefits of Mamra Almonds" />
                </label>

                <label>
                  Short description * <small>shown on the blog list and used as the meta description if none is set</small>
                  <textarea name="desc" rows={3} value={form.desc} onChange={handleChange} />
                  <span className={`blogs-count${form.desc.length > META_DESC_MAX ? ' over' : ''}`}>{form.desc.length}/{META_DESC_MAX}</span>
                </label>

                <label>
                  Content * <small>Markdown: ## Heading, **bold**, *italic*, - list, [link](https://…)</small>
                  <textarea name="content" rows={16} value={form.content} onChange={handleChange} className="blogs-content" />
                </label>
              </div>

              <div className="blogs-editor__side">
                <label>
                  Cover image {editingId ? '' : '*'}
                  <input type="file" accept="image/*" onChange={handleImage} />
                </label>
                {imagePreview && <img className="blogs-cover" src={imagePreview} alt="Cover preview" />}
                <label>
                  Image alt text <small>describe the image (SEO & accessibility)</small>
                  <input name="imageAlt" value={form.imageAlt} onChange={handleChange} />
                </label>

                <label>
                  Author *
                  <input name="author" value={form.author} onChange={handleChange} />
                </label>

                <label>
                  Tags <small>comma separated</small>
                  <input name="tags" value={form.tags} onChange={handleChange} placeholder="almonds, health, nutrition" />
                </label>

                <fieldset className="blogs-seo">
                  <legend>SEO</legend>
                  <label>
                    URL slug
                    <input name="slug" value={form.slug} onChange={handleChange} placeholder={slugPreview(form.title)} />
                  </label>
                  {editingId && <small className="blogs-warn">Changing the slug of a published post breaks existing links.</small>}
                  <label>
                    Meta title
                    <input name="metaTitle" value={form.metaTitle} onChange={handleChange} placeholder={form.title} />
                    <span className={`blogs-count${seoTitle.length > META_TITLE_MAX ? ' over' : ''}`}>{seoTitle.length}/{META_TITLE_MAX}</span>
                  </label>
                  <label>
                    Meta description
                    <textarea name="metaDescription" rows={3} value={form.metaDescription} onChange={handleChange} placeholder={form.desc} />
                    <span className={`blogs-count${seoDesc.length > META_DESC_MAX ? ' over' : ''}`}>{seoDesc.length}/{META_DESC_MAX}</span>
                  </label>

                  <div className="blogs-serp" aria-label="Google preview">
                    <span className="blogs-serp__url">{SITE_URL.replace(/^https?:\/\//, '')} › blogs › {effectiveSlug}</span>
                    <span className="blogs-serp__title">{seoTitle || 'Post title'}</span>
                    <span className="blogs-serp__desc">{seoDesc || 'Short description of the post…'}</span>
                  </div>
                </fieldset>
              </div>
            </div>

            {formError && <p className="blogs-error">{formError}</p>}

            <div className="blogs-editor__foot">
              <span className="blogs-item__date">
                Currently: {editingId ? (form.status === 'published' ? 'Published' : 'Draft') : 'New'}
              </span>
              <button disabled={saving} onClick={() => save('draft')}>
                {editingId && form.status === 'published' ? 'Unpublish & save as draft' : 'Save draft'}
              </button>
              <button className="blogs-primary" disabled={saving} onClick={() => save('published')}>
                {saving ? 'Saving…' : editingId && form.status === 'published' ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="blogs-modal" role="dialog" aria-modal="true">
          <div className="blogs-confirm">
            <p>Delete “{confirmDelete.title}”? This cannot be undone.</p>
            <div>
              <button onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="danger" onClick={remove}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
