import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [posts, setPosts] = useState([])
  const [formData, setFormData] = useState({ title: '', body: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.body) return

    setSubmitting(true)
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          title: formData.title,
          body: formData.body,
          userId: 1,
        }),
      })

      if (response.ok) {
        const newPost = await response.json()
        // JSONPlaceholder doesn't persist data, it returns what you sent with a new ID
        // We'll add it to local state to "see" it.
        setPosts(prev => [newPost, ...prev])
        setFormData({ title: '', body: '' })
        alert('Post successfully created!')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="container">
      <header>
        <h1>Post Engine</h1>
        <p>A sophisticated interface for managing and visualizing distributed data through the JSONPlaceholder ecosystem.</p>
      </header>

      <div className="layout">
        <aside className="form-section">
          <div className="card">
            <h2>Draft New Content</h2>
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
              <button type="submit" disabled={submitting}>
                {submitting ? 'Synchronizing...' : 'Publish Post'}
              </button>
            </form>
          </div>
        </aside>

        <section className="list-section">
          <h2>Published Insights</h2>
          <div className="post-list">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <article key={post.id} className="post-card" style={{ animationDelay: `${index * 0.05}s` }}>
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
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
