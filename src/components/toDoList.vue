<template>
  <div
    :id="'list' + id"
    class="to-do-list-container d-flex flex-column"
    ref="listContainer"
    :class="{ 'old-date': isOldDate }"
    :style="`flex: 0 0 ${100 / columns}%;`"
  >
    <div v-if="loading" class="loading-spinner">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <list-header
      :id="id"
      :customTodoList="customTodoList"
      :cTodoListIndex="cTodoListIndex"
      :toDoList="toDoListState"
    ></list-header>

    <ul class="to-do-list">
      <li v-for="(toDo, index) in toDoListState" :key="index">
        <DropZone
          :listId="id"
          :index="index"
          @drop="onDrop"
        >
          <to-do-item :to-do="toDo" :index="index" :to-do-list-id="id"></to-do-item>
        </DropZone>
      </li>
    </ul>

    <div class="fake-drop-zone flex-grow-1 margin-bottom-2">
      <NewToDoInput
        v-model="newToDo.text"
        @add="addToDo"
        @cancel="cancelAdd"
      />
    </div>
  </div>
</template>

<script>
import toDoItem from "./toDoItem";
// Removed the unused import for moment
import listHeader from "./listHeader";
import DropZone from "./DropZone";
import NewToDoInput from "./NewToDoInput";
import toDoListRepository from "../repositories/toDoListRepository";
import notifications from "../helpers/notifications";
import repeatingEventHelper from "../helpers/repeatingEvents.js";
import tasksHelper from "../helpers/tasksHelper";

export default {
  components: {
    listHeader,
    toDoItem,
    DropZone,
    NewToDoInput,
  },
  props: {
    id: { required: false, type: String },
    customTodoList: { required: false, default: false, type: Boolean },
    cTodoListIndex: { required: false, type: Number },
    showCustomList: { required: false, type: Boolean },
  },
  data() {
    return {
      newToDo: { text: "", checked: false },
      fakeItemCounts: 6,
      loading: false,
    };
  },
  mounted() {
    this.setTodoListHeight();
    window.addEventListener("resize", this.setTodoListHeight);
    this.loadTodoList();
  },
  unmounted() {
    window.removeEventListener("resize", this.setTodoListHeight);
  },
  methods: {
    loadTodoList() {
      const listId = this.id;
      this.loading = true;
      this.$store.dispatch("loadTodoLists", listId).then(() => {
        this.$emit("todoListMounted", listId);
      });
    },
    addToDo() {
      if (this.newToDo.text !== "") {
        const newTodo = {
          text: this.newToDo.text,
          checked: false,
          listId: this.id,
          desc: "",
          subTaskList: [],
          color: "none",
          priority: 0,
          tags: [],
          time: null,
          alarm: false,
          repeatingEvent: null,
        };
        this.$store.commit("addTodo", newTodo);
        this.updateTodoList(this.id, this.$store.getters.todoLists[this.id]);
        this.newToDo.text = "";
      }
    },
    cancelAdd() {
      this.newToDo.text = "";
    },
    onDrop({ toDo, fromIndex, listId, index }) {
      this.$store.commit("removeTodo", { toDoListId: toDo.listId, index: fromIndex });
      this.updateTodoList(toDo.listId, this.$store.getters.todoLists[toDo.listId]);
      if (toDo.listId !== listId) toDo.repeatingEvent = null;
      toDo.listId = listId;
      this.$store.commit("insertTodo", { toDoListId: listId, index, toDo });
      if (this.$store.getters.config.autoReorderTasks) {
        this.updateTodoList(listId, tasksHelper.reorderTasksList(this.$store.getters.todoLists[listId]));
      } else {
        this.updateTodoList(listId, this.$store.getters.todoLists[listId]);
      }
    },
    updateTodoList(todoListId, TodoList) {
      notifications.refreshDayNotifications(this, todoListId);
      toDoListRepository.update(todoListId, TodoList);
    },
    setTodoListHeight() {
      if (this.showCustomList) {
        this.fakeItemCounts = Math.floor(this.$refs.listContainer.clientHeight / 40);
      } else {
        this.fakeItemCounts = Math.floor(this.$refs.listContainer.clientHeight / 34);
      }
    },
    clearRemovedRepeatingEvents() {
      if (this.customTodoList) return;
      repeatingEventHelper.removeGeneratedRepeatingEvents(this.id, this);
    },
  },
  computed: {
    toDoListState() {
      return this.$store.getters.todoLists[this.id] || [];
    },
    columns() {
      return this.customTodoList
        ? this.$store.getters.config.customColumns
        : this.$store.getters.config.columns;
    },
    isOldDate() {
      if (this.customTodoList) return false;
      const today = new Date();
      const idDate = new Date(this.id);
      // Strip time for accurate 'day' comparison
      today.setHours(0, 0, 0, 0);
      idDate.setHours(0, 0, 0, 0);
      return idDate < today;
    },
  },

};
</script>

<style scoped>
.to-do-list {
  list-style: none;
  padding-inline-start: 0px;
  margin-bottom: 0px;
}

.to-do-list li {
  -webkit-transition: all 0.4s ease-out;
  transition: all 0.4s ease-out;
}

.todo-input {
  height: 1.28rem;
  line-height: 1.3rem;
  font-size: 0.865rem;
  margin: 2px 0px 2px 0px;
  padding: 0 6px 0 6px;
}

.to-do-list-container {
  padding-left: 13px;
  padding-right: 13px;
  scroll-snap-align: start;
  margin-bottom: 5px;
}

.to-do-fake-item {
  height: 1.2rem;
  width: 100%;
}

.weekly-to-do-header h4 {
  margin-bottom: 4px;
}

.weekly-to-do-header span {
  margin-top: 0px;
}

.weekly-to-do-header i {
  color: grey;
}

.weekly-to-do-header i:hover {
  color: black;
}
.weekly-to-do-header i {
  font-size: 1.4rem;
  flex-grow: 0;
  align-self: start;
  cursor: pointer;
}

.fake-item-container {
  border-bottom: 1px solid #eaecef;
  height: 1.6rem;
}

.dark-theme .fake-item-container {
  border-bottom: 1px solid #30363d;
}

.fake-drop-zone * {
  pointer-events: none;
}

.fake-drop-zone:hover * {
  pointer-events: unset;
}

.fake-drag-hover .todo-item-container {
  box-shadow: rgb(244, 243, 243) 0px 0px 4px 1px inset;
  background-color: rgb(250, 249, 249);
}

.dark-theme .fake-drag-hover .todo-item-container {
  box-shadow: #0b0d12 0px 0px 4px 1px inset;
  background-color: #0c0d14;
}

.fake-drag-hover input,
.dark-theme .fake-drag-hover input {
  background-color: unset;
}

.fake-lines {
  background-image: linear-gradient(0deg,
      #ffffff 48.08%,
      #eaecef 48.08%,
      #eaecef 50%,
      #ffffff 50%,
      #ffffff 98.08%,
      #eaecef 98.08%,
      #eaecef 100%);
  background-size: 52px 52px;
  height: calc(100% - 23px);
}

.dark-theme .fake-lines {
  background-image: linear-gradient(0deg,
      #13171d 48.08%,
      #30363d 48.08%,
      #30363d 50%,
      #13171d 50%,
      #13171d 98.08%,
      #30363d 98.08%,
      #30363d 100%);
  background-size: 52px 52px;
  height: calc(100% - 23px);
}

.fake-lines.custom-list {
  height: calc(100% - 24px);
}

.todo-input {
  line-height: 1.3rem;
  width: 100%;
  border: none;
  font-size: 0.865rem;
}

.todo-input:focus {
  outline: none;
}

.loading-spinner {
  position: relative;
  margin: auto;
  top: 200px;
  height: 0px;
}

.todo-item-container {
  border-bottom: 1px solid #eaecef;
  height: 26px;
  z-index: 1;
  margin-bottom: -1px;
}
</style>
