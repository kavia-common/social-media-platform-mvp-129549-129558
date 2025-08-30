<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useFeedStore } from '@/stores/feed'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const feed = useFeedStore()
const content = ref('')
const imageUrl = ref('')

function close() {
  emit('update:modelValue', false)
}

async function createPost() {
  if (!content.value.trim()) return
  await feed.createPost({ content: content.value.trim(), image_url: imageUrl.value || null })
  content.value = ''
  imageUrl.value = ''
  close()
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      // focus management could be added here
    }
  },
)

onMounted(() => {
  // no-op
})
</script>

<template>
  <teleport to="body">
    <div v-if="modelValue" class="overlay" @click.self="close">
      <div class="panel card">
        <div class="panel-head">
          <h3>New Post</h3>
          <button class="btn btn-outline" @click="close">Close</button>
        </div>
        <div class="panel-body">
          <label>
            <span>Content</span>
            <textarea class="textarea" v-model="content" placeholder="What's happening?"></textarea>
          </label>
          <label>
            <span>Image URL (optional)</span>
            <input class="input" v-model="imageUrl" placeholder="https://…" />
          </label>
        </div>
        <div class="panel-foot">
          <button class="btn btn-primary" @click="createPost">Post</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(38,38,38,0.45);
  display: grid;
  place-items: center;
  z-index: 50;
}
.panel {
  width: 100%;
  max-width: 520px;
  display: grid;
  gap: 12px;
  animation: slideIn .18s ease;
}
.panel-head, .panel-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.panel-body {
  display: grid;
  gap: 10px;
}
label span {
  display: block;
  font-size: 12px;
  color: #8e8e8e;
  margin-bottom: 6px;
}
@keyframes slideIn {
  from { transform: translateY(6px); opacity: .6; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
