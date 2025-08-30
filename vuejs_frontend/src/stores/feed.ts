import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PostCreateRequest, PostPublic } from '@/services/api'
import { apiCreatePost, apiGetFeed, apiToggleLike, apiToggleShare } from '@/services/api'

export const useFeedStore = defineStore('feed', () => {
  const loading = ref(false)
  const posts = ref<PostPublic[]>([])
  const error = ref<string | null>(null)

  async function loadFeed() {
    loading.value = true
    error.value = null
    try {
      posts.value = await apiGetFeed()
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load feed'
      error.value = msg
    } finally {
      loading.value = false
    }
  }

  async function createPost(payload: PostCreateRequest) {
    const post = await apiCreatePost(payload)
    // Prepend new post
    posts.value = [post, ...posts.value]
  }

  async function toggleLike(postId: number) {
    const idx = posts.value.findIndex(p => p.id === postId)
    if (idx === -1) return
    // optimistic update
    const prev = { ...posts.value[idx] }
    const next = { ...prev }
    if (next.liked_by_me) {
      next.liked_by_me = false
      next.likes = Math.max(0, next.likes - 1)
    } else {
      next.liked_by_me = true
      next.likes = next.likes + 1
    }
    posts.value.splice(idx, 1, next)
    try {
      const updated = await apiToggleLike(postId)
      posts.value.splice(idx, 1, updated)
    } catch {
      // rollback
      posts.value.splice(idx, 1, prev)
    }
  }

  async function toggleShare(postId: number) {
    const idx = posts.value.findIndex(p => p.id === postId)
    if (idx === -1) return
    const prev = { ...posts.value[idx] }
    const next = { ...prev }
    if (next.shared_by_me) {
      next.shared_by_me = false
      next.shares = Math.max(0, next.shares - 1)
    } else {
      next.shared_by_me = true
      next.shares = next.shares + 1
    }
    posts.value.splice(idx, 1, next)
    try {
      const updated = await apiToggleShare(postId)
      posts.value.splice(idx, 1, updated)
    } catch {
      posts.value.splice(idx, 1, prev)
    }
  }

  return {
    loading,
    posts,
    error,
    loadFeed,
    createPost,
    toggleLike,
    toggleShare,
  }
})
