<template>
    <div>
        <topheader></topheader>
        <div class="EditorClass">
          <editor></editor>
        </div>
    </div>
</template>
<script>
import topheader from '@/components/common/topheader'
import editor from '@/components/common/editor'
export default {
  name: 'writeNewComment',
  methods: {
  },
  components: {
    topheader,
    editor
  }
}
</script>
<style>
  .EditorClass {
    font-size: 16px;
    top: 1rem;
    width: 100%;
    position: fixed;
    z-index:0
  }
</style>
