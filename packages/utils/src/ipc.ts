export const IPC_EVENTS = {
  CLIPBOARD: {
    SET: 'clipboard-set',
    GET: 'clipboard-get',
  },
  GLOBAL_SHORTCUT: {
    REGISTER: 'global-shortcut-register',
    UNREGISTER: 'global-shortcut-unregister',
    UNREGISTER_ALL: 'global-shortcut-unregister-all',
    IS_REGISTERED: 'global-shortcut-is-registered',
  },
  WINDOW: {
    SET_MODE: 'window-set-mode',
    GET_MODE: 'window-get-mode',
    TOGGLE_VISIBILITY: 'window-toggle-visibility',
    SHOW: 'window-show',
    HIDE: 'window-hide',
  },
} as const
