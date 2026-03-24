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
    <div className="container">
      <header>
        <h1>JSONPlaceholder API Demo</h1>
        <p>Post Management</p>
      </header>

      <div className="layout">
        <section className="form-section">
          <div className="card">
            <h2>Create New Post</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter post title..."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="body">Description</label>
                <textarea
                  id="body"
                  name="body"
                  value={formData.body}
                  onChange={handleInputChange}
                  placeholder="Enter post description..."
                  rows="4"
                  required
                ></textarea>
              </div>
              <button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Submit Post'}
              </button>
            </form>
          </div>
        </section>

        <section className="list-section">
          <h2>Recent Posts</h2>
          <div className="post-list">
            {posts.length > 0 ? (
              posts.map(post => (
                <article key={post.id} className="post-card">
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                </article>
              ))
            ) : (
              <div className="empty-state">No posts created yet. Try adding one!</div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
