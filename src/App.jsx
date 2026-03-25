import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [posts, setPosts] = useState([])
  const [formData, setFormData] = useState({ title: '', body: '' })
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // No initial fetch - start with a clean state as requested
  useEffect(() => {
    // Initial content system ready
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // POST & PUT Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.body) return

    setSubmitting(true)
    const url = editingId 
      ? `https://jsonplaceholder.typicode.com/posts/${editingId}`
      : 'https://jsonplaceholder.typicode.com/posts'
    
    const method = editingId ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          title: formData.title,
          body: formData.body,
          userId: 1,
        }),
      })

      // In mock environment, we prioritize local UI state updates regardless of server 404s
      const localFormattedPost = { 
        title: formData.title, 
        body: formData.body, 
        userId: 1,
        id: editingId || (101 + posts.length + Math.floor(Math.random() * 1000))
      }
      
      if (editingId) {
        setPosts(prev => prev.map(p => p.id === editingId ? localFormattedPost : p))
        alert('Data System: Document synchronized.')
      } else {
        setPosts(prev => [localFormattedPost, ...prev])
        alert('Data System: New entry recorded.')
      }
      
      // Reset form and editing state
      setFormData({ title: '', body: '' })
      setEditingId(null)
    } catch (error) {
      console.error('System synchronization issue:', error)
      alert('Network transmission failed. Please check your connection.')
    } finally {
      setSubmitting(false)
    }
  }

  // DELETE Handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from local state
        setPosts(prev => prev.filter(p => p.id !== id))
        alert('Post deleted successfully')
        
        // If we were editing this post, reset the form
        if (editingId === id) {
          setFormData({ title: '', body: '' })
          setEditingId(null)
        }
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post.')
    }
  }

  // Initialize Edit Mode
  const startEdit = (post) => {
    setEditingId(post.id)
    setFormData({ title: post.title, body: post.body })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ title: '', body: '' })
  }

  return (
    <main className="container">
      <header>
        <h1>Posts</h1>
      </header>

      <div className="layout">
        <aside className="form-section">
          <div className={`card ${editingId ? 'editing-active' : ''}`}>
            <h2>{editingId ? 'Refine Content' : 'Draft New Content'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Post Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. The Future of Web Architecture"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="body">Content Body</label>
                <textarea
                  id="body"
                  name="body"
                  value={formData.body}
                  onChange={handleInputChange}
                  placeholder="Enter the core message of your post..."
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="button-group">
                <button type="submit" disabled={submitting} className="primary-btn">
                  {submitting ? 'Synchronizing...' : editingId ? 'Update Post' : 'Publish Post'}
                </button>
                {editingId && (
                  <button type="button" onClick={cancelEdit} className="secondary-btn">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </aside>

        <section className="list-section">
          <h2>Published Insights</h2>
          <div className="post-list">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <article key={post.id} className="post-card" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="post-header">
                    <span className="post-category">Publication</span>
                    <span className="post-index">#{(posts.length - index).toString().padStart(3, '0')}</span>
                  </div>
                  <div className="post-content">
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                  </div>
                  <div className="post-actions">
                    <button onClick={() => startEdit(post)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(post.id)} className="delete-btn">Delete</button>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <p>No active insights found.</p>
                <small>Start by drafting a new post in the control panel.</small>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
