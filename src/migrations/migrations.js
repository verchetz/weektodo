import configRepository from "../repositories/configRepository";
import moment from "moment";

function updateConfigIfMissing(key, defaultValue) {
  let config = configRepository.load();
  if (!(key in config)) {
    config[key] = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    configRepository.update(config);
  }
}

export default {
  migrate() {
    configCheckUpdate();
    configCalendarZoomColumnsCalendarHeight();
    configNotifications();
    runInBackground();
    mainDividerPosition();
    trayIcon();
    telemetric();
    v2_1_0();
    v2_2_0();
  },
};

function configCheckUpdate() {
  updateConfigIfMissing("checkUpdates", true);
}

function configCalendarZoomColumnsCalendarHeight() {
  let config = configRepository.load();
  if (!("calendar" in config)) {
    config["calendar"] = true;
    config["zoom"] = 100;
    config["columns"] = 5;
    config["calendarHeight"] = "calc(50% - 50px)";
    configRepository.update(config);
  }
}

function configNotifications() {
  let config = configRepository.load();
  if (!("startupNotification" in config)) {
    config["notificationOnStartup"] = true;
    config["notificationSound"] = "pop";
    config["openOnStartup"] = true;
    configRepository.update(config);
  }
}

function runInBackground() {
  let config = configRepository.load();
  if (!("runInBackground" in config)) {
    config["runInBackground"] = true;
    config["moveOldTasks"] = true;
    config["dateToShowInitialDonateModal"] = moment().add(15, "d").format("YYYY-MM-DD");
    config["InitialDonateModalShown"] = false;
    configRepository.update(config);
  }
}

function mainDividerPosition() {
  updateConfigIfMissing("mainDividerPosition", 1);
}

function trayIcon() {
  let config = configRepository.load();
  if (!("darkTrayIcon" in config)) {
    config["darkTrayIcon"] = false;
    config["importing"] = false;
    configRepository.update(config);
  }
}

function telemetric() {
  let config = configRepository.load();
  if (!("reportErrors" in config)) {
    config["reportErrors"] = false;
    config["customColumns"] = config["columns"];
    config["compactView"] = true;
    config["startCalendarYesterday"] = true;
    config["notificationIndicator"] = true;
    config["autoReorderTasks"] = false;
    config["moveCompletedTaskToBottom"] = true;
    configRepository.update(config);
  }
}

function v2_1_0() {
  let config = configRepository.load();
  if (!("fullscreenToDoModal" in config)) {
    config["fullscreenToDoModal"] = false;
    config["moveCompletedSubTaskToBottom"] = true;
    config["weekStartOnMonday"] = true;
    configRepository.update(config);
  }
}

function v2_2_0() {
  updateConfigIfMissing("lastDayOpened", () => moment().format("YYYY-MM-DD"));
}
