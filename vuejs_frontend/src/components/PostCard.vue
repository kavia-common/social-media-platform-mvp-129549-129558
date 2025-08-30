<script setup lang="ts">
import type { PostPublic } from '@/services/api'
import { computed } from 'vue'

const props = defineProps<{ post: PostPublic }>()
const emit = defineEmits<{
  (e: 'like', id: number): void
  (e: 'share', id: number): void
}>()

const time = computed(() => {
  const d = new Date(props.post.created_at)
  return d.toLocaleString()
})
</script>

<template>
  <article class="card post">
    <header class="post-head">
      <div class="avatar">{{ post.author.slice(0, 1).toUpperCase() }}</div>
      <div class="meta">
        <div class="author">{{ post.author }}</div>
        <div class="time muted">{{ time }}</div>
      </div>
    </header>

    <p class="content">{{ post.content }}</p>

    <img v-if="post.image_url" class="image" :src="post.image_url" alt="post image" />

    <footer class="actions">
      <button
        class="btn action"
        :class="{ active: post.liked_by_me }"
        @click="emit('like', post.id)"
        title="Like"
      >
        <span class="heart">♥</span>
        <span>{{ post.likes }}</span>
      </button>
      <button
        class="btn action"
        :class="{ shared: post.shared_by_me }"
        @click="emit('share', post.id)"
        title="Share"
      >
        <span class="share">⤴</span>
        <span>{{ post.shares }}</span>
      </button>
    </footer>
  </article>
</template>

<style scoped>
.post {
  display: grid;
  gap: 10px;
}
.post-head {
  display: flex;
  gap: 10px;
  align-items: center;
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
.meta .author {
  font-weight: 700;
  color: #262626;
}
.content {
  white-space: pre-wrap;
}
.image {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #efefef;
}
.actions {
  display: flex;
  gap: 10px;
}
.action {
  gap: 8px;
  display: inline-flex;
  align-items: center;
  border-color: #efefef;
}
.action .heart {
  color: #ed4956;
}
.action.active {
  background: rgba(237, 73, 86, 0.08);
  border-color: rgba(237, 73, 86, 0.2);
}
.action.shared {
  background: rgba(56, 151, 240, 0.08);
  border-color: rgba(56, 151, 240, 0.2);
}
</style>
