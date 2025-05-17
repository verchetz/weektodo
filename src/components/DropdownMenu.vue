<template>
  <ul class="dropdown-menu" aria-labelledby="btnTaskOptionMenu">
    <li>
      <button class="dropdown-item" type="button" @click="newTask">
        <i class="bi-plus-lg"></i> <span>{{ $t('ui.newTask') }}</span>
      </button>
    </li>
    <li v-show="!allTodoChecked()">
      <button class="dropdown-item" type="button" @click="check_all_items">
        <i class="bi-check2-all"></i> <span>{{ $t('ui.completeAll') }}</span>
      </button>
    </li>
    <li>
      <button class="dropdown-item" type="button" @click="sortItems">
        <i class="bi-sort-down"></i> <span>{{ $t('ui.reorder') }}</span>
      </button>
    </li>
    <li v-show="!customTodoList && !allTodoChecked()">
      <button class="dropdown-item" type="button" @click="moveUndoneItems">
        <i class="bi-reply-all"></i> <span>{{ $t('ui.postpone') }}</span>
      </button>
    </li>
    <li>
      <button class="dropdown-item" type="button" @click="copyListTasksToClipboard">
        <i class="bi-clipboard"></i> <span>{{ $t('ui.copyTasks') }}</span>
      </button>
    </li>
    <li>
      <hr class="dropdown-divider" />
    </li>
    <li>
      <button class="dropdown-item" type="button" @click="clearList" data-bs-toggle="modal" data-bs-target="#clearListModal">
        <i class="bi-trash"></i> <span>{{ $t('ui.clearList') }}</span>
      </button>
    </li>
    <li v-show="customTodoList">
      <button class="dropdown-item" type="button" data-bs-dismiss="modal" @click="removeList" data-bs-toggle="modal"
        data-bs-target="#customListRemoveModal">
        <i class="bi-x-circle"></i> <span>{{ $t('ui.removeList') }}</span>
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    customTodoList: Boolean,
    allTodoChecked: Function,
    newTask: Function,
    check_all_items: Function,
    sortItems: Function,
    moveUndoneItems: Function,
    copyListTasksToClipboard: Function,
    clearList: Function,
    removeList: Function,
  },
};
</script>

<style scoped>
/* Dropdown menu styles */
.dropdown-menu {
  font-size: 0.865rem;
  min-width: unset;
  border-radius: 8px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .20);
  border: none;
  color: #3c3c3c;

  .dropdown-item {
    padding: .4rem 1.9rem .4rem .65rem;
  }

  .dropdown-divider {
    margin: .3rem;
  }

  i {
    font-size: 0.99rem;
    margin-right: 11px;
    display: inline-block;
  }
}
</style>