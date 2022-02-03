export const ConfigConsts = {
  COMMON: {
    PANEL_ID: {
      USER_PROFILE: '/user/profile',
    },
  },
  MEMBER: {
    APP_ID: 'member',
    PANEL_ID: {
      TOP: '/member',
      INQ_RENTAL_ITEM: '/member/item',
      ENT_RESERVATION_FLOW: '/member/reservation',
      INQ_RESERVATION: '/member/history',
    },
  },
  ADMIN: {
    APP_ID: 'admin',
    PANEL_ID: {
      TOP: '/admin',
      ITEM_MAINT: '/admin/item',
      RESERVATION_MAINT: '/admin/reservation',
      USER_MAINT: '/admin/user',
    },
  },
  RMS_ERROR_CODE: {
    AUTH_ERROR: 'RMS0401',
    OTHER_ERROR: 'RMS9999',
  },
};
