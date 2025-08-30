<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFeedStore } from '@/stores/feed'
import { useAuthStore } from '@/stores/auth'
import PostCard from '@/components/PostCard.vue'

const route = useRoute()
const feed = useFeedStore()
const auth = useAuthStore()

const username = computed(() => route.params.username as string)
const myPosts = computed(() => feed.posts.filter(p => p.author === username.value))

onMounted(async () => {
  if (!feed.posts.length) {
    await feed.loadFeed()
  }
})
</script>

<template>
  <div class="profile-wrap">
    <div class="card header">
      <div class="avatar">{{ username.slice(0,1).toUpperCase() }}</div>
      <div class="info">
        <h2>@{{ username }}</h2>
        <p class="muted">Signed in as @{{ auth.user?.username }}</p>
      </div>
    </div>

    <h3>Posts</h3>
    <div class="list">
      <PostCard
        v-for="p in myPosts"
        :key="p.id"
        :post="p"
        @like="feed.toggleLike"
        @share="feed.toggleShare"
      />
      <p v-if="!myPosts.length" class="muted">No posts yet.</p>
    </div>
  </div>
</template>

<style scoped>
.profile-wrap {
  display: grid;
  gap: 14px;
}
.header {
  display: flex;
  gap: 12px;
  align-items: center;
}
.avatar {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, #ed4956, #3897f0);
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #fff;
  font-size: 24px;
}
.info h2 {
  margin: 0;
}
.list {
  display: grid;
  gap: 12px;
}
</style>
