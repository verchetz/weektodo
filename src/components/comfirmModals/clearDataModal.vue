<template>
  <comfirm-modal :id="'clearDataModal'" :title="$t('settings.clearData')" :text="$t('settings.clearDataDetails')"
    :ico="'bi-x-circle'" :okText="$t('settings.clearData')" @on-ok="clearData">
  </comfirm-modal>
</template>
<script>
import comfirmModal from "../../components/comfirmModal.vue";
import exportTool from "../../helpers/exportTool";
import isElectron from "is-electron";

export default {
  name: "clearDataModal",
  components: {
    comfirmModal
  },
  methods: {
    clearData() {
      if (isElectron()) {
        let ipcRenderer;
        try {
          // Dynamically require electron only in Electron environment
          ipcRenderer = require('electron').ipcRenderer;
        } catch (e) {
          ipcRenderer = null;
        }
        if (ipcRenderer) {
          ipcRenderer.send('set-tray-context-menu-label', { open: 'Open', quit: 'Quit' });
          ipcRenderer.send('set-dark-tray-icon', false);
        }
      }
      exportTool.clear();
    },
  },
};
</script>