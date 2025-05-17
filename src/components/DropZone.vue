<template>
  <div
    class="drop-zone"
    @drop="handleDrop"
    @dragover.prevent
    @dragenter.prevent
    @dragleave="onDragLeave"
    :class="{ 'drag-hover': isDragging }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    listId: { type: String, required: true },
    index: { type: Number, required: false },
  },
  data() {
    return {
      isDragging: false,
    };
  },
  methods: {
    handleDrop(event) {
      const toDo = JSON.parse(event.dataTransfer.getData("item"));
      const fromIndex = event.dataTransfer.getData("index");
      this.$emit("drop", { toDo, fromIndex, listId: this.listId, index: this.index });
      this.isDragging = false;
    },
    onDragLeave() {
      this.isDragging = false;
    },
  },
};
</script>

<style scoped>
.drop-zone {
  border: 1px dashed transparent;
  transition: border-color 0.3s;
}
.drag-hover {
  border-color: #007bff;
}
</style>