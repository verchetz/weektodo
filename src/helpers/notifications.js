import moment from "moment";

export default {
  refreshDayNotifications(vue, todoListId) {
    let todoList = vue.$store.getters.todoLists[todoListId];
    var notificationSound = vue.$store.getters.config.notificationSound;
    if (todoListId != moment().format("YYYYMMDD")) return;

    vue.$store.getters.notifications.forEach((notification) => {
      clearTimeout(notification);
    });
    var notificationsList = [];

    if (todoList != null)
      todoList.forEach((todo) => {
        if (todo.alarm && !todo.checked && moment(todo.time, "HH:mm") >= moment()) {
          notificationsList.push(this.createNotificationAlert(todo.time, todo.text, notificationSound));
        }
      });

    vue.$store.commit("setNotificatios", notificationsList);
  },
  createNotificationAlert(todoTime, todoText, notificationSound) {
    var x = new moment();
    var y = new moment(todoTime, "HH:mm");
    var duration = moment.duration(y.diff(x)).asMilliseconds();

    var alertTimeOut = setTimeout(
      function () {
        this.createNotification(moment(todoTime, "HH:mm").format("LT"), todoText, notificationSound);
      }.bind(this),
      duration
    );

    return alertTimeOut;
  },
  createNotification(header, body, notificationSound) {
    new Notification(header, {
      body: body,
      icon: "/favicon.ico",
      silent: true,
    });
    this.playNotificationSound(notificationSound);
  },
  playNotificationSound(notificationSound) {
    const soundMap = {
      pop: "sounds/pop-alert.ogg",
      positive: "sounds/positive.ogg",
      bell: "sounds/loud-bell.ogg",
      soft: "sounds/soft.ogg",
      tiny: "sounds/tiny.ogg",
      piano: "sounds/piano.ogg",
      "soft-bell": "sounds/soft-bell.ogg",
      metal: "sounds/metal-gear.ogg",
    };
    if (notificationSound === "none") return;
    const soundPath = soundMap[notificationSound];
    if (!soundPath) return;
    const sound = new Audio(soundPath);
    sound.addEventListener("canplaythrough", () => {
      sound.play();
    });
  },
};
