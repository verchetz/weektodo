// filepath: c:\TUGAS\Binus\semester-4\CR\AOL\weektodo\src\components\NewToDoInput.vue
<template>
  <div class="new-todo-input">
    <input
      type="text"
      v-model="inputValue"
      @keyup.enter="add"
      @keyup.esc="cancel"
      placeholder="Add a new to-do"
    />
  </div>
</template>

<script>
export default {
  props: {
    modelValue: { type: String, required: true },
  },
  emits: ["add", "cancel", "update:modelValue"],
  data() {
    return {
      inputValue: this.modelValue,
    };
  },
  watch: {
    inputValue(newValue) {
      this.$emit("update:modelValue", newValue);
    },
  },
  methods: {
    add() {
      this.$emit("add", this.inputValue);
      this.inputValue = "";
    },
    cancel() {
      this.$emit("cancel");
      this.inputValue = "";
    },
  },
};
</script>

<style scoped>
.new-todo-input input {
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>