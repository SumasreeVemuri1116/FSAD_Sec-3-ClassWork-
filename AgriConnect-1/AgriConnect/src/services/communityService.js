const STORAGE_KEY = 'agriconnect_posts'

const seedPosts = [
  {
    id: 'seed-1',
    type: 'question',
    author: 'Ramesh Kumar',
    location: 'Punjab',
    avatar: '👨‍🌾',
    title: 'Best time to sow wheat seeds in Punjab region?',
    content: 'I am planning to sow wheat this season. What is the optimal time for sowing in Punjab? Should I wait for more rainfall or start now?',
    category: 'Crop Management',
    upvotes: 45,
    comments: 12,
    timeAgo: '2 hours ago',
    tags: ['wheat', 'punjab', 'sowing'],
    answered: true,
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: 'seed-2',
    type: 'success',
    author: 'Lakshmi Devi',
    location: 'Karnataka',
    avatar: '👩‍🌾',
    title: 'Increased tomato yield by 60% using organic methods!',
    content: 'After switching to organic farming and following expert advice from this community, my tomato yield increased dramatically. Here\'s what I did: Used vermicompost, neem oil for pest control, and drip irrigation. Happy to share more details!',
    category: 'Success Story',
    upvotes: 289,
    comments: 34,
    timeAgo: '5 hours ago',
    tags: ['organic', 'tomato', 'success'],
    image: 'https://images.unsplash.com/photo-1571407614e0c4d1bb0f63e73b7032fc7?auto=format&fit=crop&w=400&q=80',
    createdAt: Date.now() - 5 * 60 * 60 * 1000,
  },
  {
    id: 'seed-3',
    type: 'discussion',
    author: 'Dr. Priya Sharma',
    location: 'Expert',
    avatar: '👩‍🔬',
    title: 'Integrated Pest Management: A Complete Guide',
    content: 'As an agricultural expert, I want to share a comprehensive guide on IPM. This approach reduces chemical pesticide use by 70% while maintaining crop health. Key strategies include: crop rotation, biological pest control, and regular monitoring.',
    category: 'Expert Advice',
    upvotes: 567,
    comments: 89,
    timeAgo: '1 day ago',
    tags: ['ipm', 'pestcontrol', 'expert'],
    verified: true,
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
  },
]

const getCurrentUser = () => {
  const raw = window.localStorage.getItem('agriconnectUser')
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const getStoredPosts = () => {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return [...seedPosts]
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : [...seedPosts]
  } catch {
    return [...seedPosts]
  }
}

const savePosts = (posts) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

const getTimeAgoLabel = (createdAt) => {
  const diffMs = Date.now() - createdAt
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diffMs < hour) {
    const mins = Math.max(1, Math.floor(diffMs / minute))
    return `${mins} minute${mins > 1 ? 's' : ''} ago`
  }

  if (diffMs < day) {
    const hours = Math.max(1, Math.floor(diffMs / hour))
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }

  const days = Math.max(1, Math.floor(diffMs / day))
  return `${days} day${days > 1 ? 's' : ''} ago`
}

export const getCommunityPosts = () => {
  const posts = getStoredPosts()
  return posts
    .map((post) => ({
      ...post,
      timeAgo: post.timeAgo || getTimeAgoLabel(post.createdAt || Date.now()),
    }))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
}

export const getCommunityPostById = (id) => {
  const posts = getCommunityPosts()
  return posts.find((post) => String(post.id) === String(id)) || null
}

export const createCommunityPost = (input) => {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    throw new Error('Please login to continue')
  }

  const tags = (input.tags || '')
    .split(',')
    .map((tag) => tag.trim().replace(/^#/, '').toLowerCase())
    .filter(Boolean)

  const createdAt = Date.now()
  const post = {
    id: `post-${createdAt}`,
    type: input.postType,
    author: currentUser.fullName || currentUser.email || 'Community Member',
    location: currentUser.role === 'expert' ? 'Expert' : 'India',
    avatar: currentUser.role === 'expert' ? '👩‍🔬' : '👨‍🌾',
    title: input.title.trim(),
    content: input.content.trim(),
    category: input.category,
    upvotes: 0,
    comments: 0,
    timeAgo: 'Just now',
    tags,
    verified: currentUser.role === 'expert',
    createdAt,
    createdBy: currentUser.id || currentUser.email,
  }

  const existing = getStoredPosts()
  savePosts([post, ...existing])
  return post
}
