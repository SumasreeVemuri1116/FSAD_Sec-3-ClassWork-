import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { getCommunityPosts } from '../services/communityService'

function VedikaPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')

  const posts = useMemo(() => getCommunityPosts(), [])

  const categories = [
    { name: 'All Posts', value: 'all', icon: '📋', count: posts.length },
    { name: 'Questions', value: 'question', icon: '❓', count: posts.filter(p => p.type === 'question').length },
    { name: 'Success Stories', value: 'success', icon: '⭐', count: posts.filter(p => p.type === 'success').length },
    { name: 'Discussions', value: 'discussion', icon: '💬', count: posts.filter(p => p.type === 'discussion').length },
    { name: 'Suggestions', value: 'suggestion', icon: '💡', count: posts.filter(p => p.type === 'suggestion').length },
  ]

  const filteredPosts = activeTab === 'all' 
    ? posts 
    : posts.filter(post => post.type === activeTab)

  const getTypeColor = (type) => {
    const colors = {
      question: '#2196F3',
      success: '#4CAF50',
      discussion: '#FF9800',
      suggestion: '#9C27B0'
    }
    return colors[type] || '#757575'
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <Link className="back-link" to="/">
          Back to home
        </Link>
        <h1>Vedika - Farmer Community</h1>
        <p>Connect, share, and learn from fellow farmers and agricultural experts</p>
      </header>

      {/* Hero Section */}
      <div className="page-card" style={{ 
        background: 'linear-gradient(135deg, #5eb62f 0%, #4a9625 100%)', 
        color: 'white',
        padding: '32px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '12px', color: 'white' }}>
              🌾 Welcome to Vedika
            </h2>
            <p style={{ fontSize: '1.05rem', marginBottom: '16px', opacity: 0.95 }}>
              Join thousands of farmers sharing knowledge, experiences, and success stories
            </p>
            <div style={{ display: 'flex', gap: '24px', fontSize: '0.95rem' }}>
              <div>
                <strong style={{ fontSize: '1.4rem', display: 'block' }}>50K+</strong>
                <span style={{ opacity: 0.9 }}>Farmers</span>
              </div>
              <div>
                <strong style={{ fontSize: '1.4rem', display: 'block' }}>500+</strong>
                <span style={{ opacity: 0.9 }}>Experts</span>
              </div>
              <div>
                <strong style={{ fontSize: '1.4rem', display: 'block' }}>15K+</strong>
                <span style={{ opacity: 0.9 }}>Discussions</span>
              </div>
            </div>
          </div>
          <button
            style={{
              padding: '14px 28px',
              background: 'white',
              color: '#5eb62f',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
            onClick={() => navigate('/create-post')}
          >
            ✍️ Create Post
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px',
        overflowX: 'auto',
        padding: '4px'
      }}>
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveTab(cat.value)}
            style={{
              padding: '12px 20px',
              background: activeTab === cat.value ? '#5eb62f' : 'white',
              color: activeTab === cat.value ? 'white' : '#2c281d',
              border: activeTab === cat.value ? 'none' : '2px solid #e5dfd0',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              fontSize: '0.95rem',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
            <span>{cat.name}</span>
            <span style={{
              background: activeTab === cat.value ? 'rgba(255,255,255,0.3)' : '#f5ead0',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.85rem'
            }}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredPosts.map(post => (
          <article 
            key={post.id} 
            className="page-card" 
            style={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              position: 'relative'
            }}
            onClick={() => navigate(`/vedika/post/${post.id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Post Header */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{ 
                fontSize: '2.5rem',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5ead0',
                borderRadius: '50%'
              }}>
                {post.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '1rem', color: '#2c281d' }}>
                    {post.author}
                  </strong>
                  {post.verified && (
                    <span style={{
                      background: '#2196F3',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      ✓ Expert
                    </span>
                  )}
                  <span style={{ 
                    padding: '2px 10px',
                    background: getTypeColor(post.type),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {post.type}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6b6457' }}>
                  📍 {post.location} • ⏰ {post.timeAgo}
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                marginBottom: '8px', 
                color: '#2c281d',
                fontWeight: '600'
              }}>
                {post.title}
              </h3>
              <p style={{ 
                margin: '0 0 12px 0', 
                color: '#6b6457', 
                lineHeight: '1.6',
                fontSize: '0.95rem'
              }}>
                {post.content}
              </p>
              {post.image && (
                <img 
                  src={post.image} 
                  alt={post.title}
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginTop: '12px'
                  }}
                />
              )}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              {post.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  style={{
                    padding: '4px 10px',
                    background: '#f5ead0',
                    color: '#5c4a1f',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Post Footer */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingTop: '12px',
              borderTop: '1px solid #e5dfd0'
            }}>
              <div style={{ display: 'flex', gap: '24px' }}>
                <button 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b6457',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  👍 {post.upvotes}
                </button>
                <button 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b6457',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/vedika/post/${post.id}`)
                  }}
                >
                  💬 {post.comments} replies
                </button>
              </div>
              {post.type === 'question' && (
                <span style={{
                  padding: '4px 12px',
                  background: post.answered ? '#4CAF50' : '#FF9800',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {post.answered ? '✓ Answered' : '⏳ Pending'}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Community Guidelines */}
      <div className="page-card" style={{ 
        marginTop: '32px', 
        background: 'linear-gradient(135deg, #f5ead0 0%, #efe3c6 100%)',
        border: '2px solid #d9c6a3'
      }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '16px', color: '#5c4a1f' }}>
          📜 Community Guidelines
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '12px'
        }}>
          {[
            'Be respectful and supportive',
            'Share genuine experiences',
            'Verify information before posting',
            'Help fellow farmers learn',
            'Report spam or misleading content'
          ].map((guideline, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ color: '#5eb62f', fontWeight: 'bold', fontSize: '1.1rem' }}>✓</span>
              <span style={{ color: '#5c4a1f', fontSize: '0.9rem' }}>{guideline}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="page-card" style={{ 
        marginTop: '24px', 
        textAlign: 'center', 
        background: 'linear-gradient(135deg, #5eb62f 0%, #4a9625 100%)', 
        color: 'white' 
      }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'white' }}>
          Have a Question or Success Story?
        </h3>
        <p style={{ fontSize: '1rem', marginBottom: '20px', color: 'rgba(255, 255, 255, 0.9)' }}>
          Share your experience with the community and get expert advice
        </p>
        <button
          style={{
            padding: '12px 32px',
            background: 'white',
            color: '#5eb62f',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/create-post')}
        >
          Create Your First Post
        </button>
      </div>
    </div>
  )
}

export default VedikaPage
