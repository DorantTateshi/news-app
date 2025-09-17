<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <div :id="id" class="min-h-[200px] border border-gray-300 rounded-lg"></div>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  error?: string
  placeholder?: string
  id?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Write your content...',
  id: () => `quill-editor-${Math.random().toString(36).substr(2, 9)}`
})

const emit = defineEmits<Emits>()

let quill: any = null

onMounted(async () => {
  // Dynamic import to avoid SSR issues
  const { default: Quill } = await import('quill')

  // Import Quill styles
  if (process.client) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css'
    document.head.appendChild(link)
  }

  await nextTick()

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'],                                         // remove formatting button
    ['link', 'image']                                  // link and image
  ]

  quill = new Quill(`#${props.id}`, {
    theme: 'snow',
    placeholder: props.placeholder,
    modules: {
      toolbar: toolbarOptions
    }
  })

  // Set initial content
  if (props.modelValue) {
    quill.root.innerHTML = props.modelValue
  }

  // Listen for changes
  quill.on('text-change', () => {
    const html = quill.root.innerHTML
    emit('update:modelValue', html)
  })
})

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (quill && quill.root.innerHTML !== newValue) {
    quill.root.innerHTML = newValue || ''
  }
})
</script>

<style>
/* Additional Quill customizations */
.ql-editor {
  min-height: 150px;
}

.ql-toolbar {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.ql-container {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}
</style>