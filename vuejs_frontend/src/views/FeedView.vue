<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFeedStore } from '@/stores/feed'
import { useAuthStore } from '@/stores/auth'
import PostCreateModal from '@/components/PostCreateModal.vue'
import PostCard from '@/components/PostCard.vue'

const feed = useFeedStore()
const auth = useAuthStore()
const openCreate = ref(false)

onMounted(async () => {
  await auth.fetchMe()
  await feed.loadFeed()
})

function like(id: number) {
  feed.toggleLike(id)
}
function share(id: number) {
  feed.toggleShare(id)
}
</script>

<template>
  <div class="feed-wrap">
    <div class="composer card">
      <div class="row">
        <div class="avatar">{{ (auth.user?.username || 'U').slice(0,1).toUpperCase() }}</div>
        <button class="btn btn-outline grow" @click="openCreate = true">What's on your mind?</button>
        <button class="btn btn-primary" @click="openCreate = true">Create</button>
      </div>
    </div>

    <div v-if="feed.loading" class="muted">Loading feed…</div>
    <div v-if="feed.error" class="error">{{ feed.error }}</div>

    <div class="list">
      <PostCard
        v-for="p in feed.posts"
        :key="p.id"
        :post="p"
        @like="like"
        @share="share"
      />
    </div>

    <PostCreateModal v-model="openCreate" />
  </div>
</template>

<style scoped>
.feed-wrap {
  display: grid;
  gap: 14px;
}
.row {
  display: flex;
  gap: 10px;
  align-items: center;
}
.grow {
  flex: 1;
  text-align: left;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f0f2f5;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #555;
}
.error {
  color: #ed4956;
}
.list {
  display: grid;
  gap: 12px;
}
</style>
