import { Utilities } from "./utils";

//DATA PROPIA DE LA APLICACION
export const MENU = [
  {
    title: 'Menú',
    rows: [
      {
        id: 'menu_0',
        title: 'Información planes',
      },
      {
        id: 'menu_2',
        title: 'Adquiere tu plan',
      },
      {
        id: 'menu_1',
        title: 'Renovar mi plan',
        description: '❌NO DISPONIBLE POR EL MOMENTO❌'
      },

    ]
  }
];







export const SCHUDULE_LIST = [
  {
    id: '1',
    title: '21/01/2024 10:00 am',
  },
  {
    id: '2',
    title: '21/01/2024 11:00 am',
  },
  {
    id: '3',
    title: '21/01/2024 12:00 am',
  },
  {
    id: '4',
    title: '22/01/2024 10:00 am',
  },
  {
    id: '5',
    title: '25/01/2024 10:00 am',
  },
  {
    id: '6',
    title: '25/01/2024 11:00 am',
  },
  {
    id: '7',
    title: ' 28/01/2024 10:00 am',
  }
];
// Pasos de la conversación

export const STEPS = {
  INIT: '0',
  CHOOSE_DATE_OPT: '1',
  DESCRIPTION_INSERTED: '2',
  CHOOSE_HOUR_OPT: '3',
  CHOOSE_PAYMENT_OPT: '4',
  PROCESS_VOUCHER: '5',
  GET_CONFIRM: '6',
  DAY_SELECTED: '7',
  DAY_NUMBER_SELECTED: '8',
};

// MENSAJES Y ID DE MENSAJES INTERACTIVOS


export enum PAYMENTSTATUS {
  PENDING = '0',
  WAITING = '1',
  ACCEPTED = '2',
  REJECTED = '3',
}

export const NAME_TEMPLATES = {
  NOTIFY_PAYMENT: 'new_payment',
  NEW_CONVERSATION: 'new_conversation',
}

export const BTN_ID = {
  ACCEPT_DNI: 'accpt_dni',
  RETRY_DNI: 'retry_dni',
  CONFIRM_GENERAL: 'confirm_general',
  CANCEL_GENERAL: 'cancel_general',
  PAYMENT_YAPE: 'yape_plin',
  CURRENT_DATE: 'current_date',
  CURRENT_WEEK: 'current_week',
  CURRENT_MONTH: 'current_month',
  DIFFERENT_DATE: 'different_date',
  RESET: 'reset',
}

export const BTN_TITLE = {
  ACCEPT_DNI: 'Confirmar ✅',
  RETRY_DNI: 'Volver a intentar 👀',
  CONFIRM_GENERAL: '✅ Confirmar',
  CANCEL_GENERAL: '❌ Cancelar',
  PAYMENT_YAPE: 'Yape/Plin 📱',
  CURRENT_DATE: 'Hoy',
  CURRENT_WEEK: 'Esta semana',
  CURRENT_MONTH: 'Este mes',
  DIFFERENT_DATE: 'Otra fecha',
  RESET: 'Reset',
}

export const BTN_OPT_CONFIRM_DNI = [
  {
    id: BTN_ID.ACCEPT_DNI,
    title: BTN_TITLE.ACCEPT_DNI,
  },
  {
    id: BTN_ID.RETRY_DNI,
    title: BTN_TITLE.RETRY_DNI,
  },
];


export const BTN_OPT_CONFIRM_GENERAL = [
  {
    id: BTN_ID.CONFIRM_GENERAL,
    title: BTN_TITLE.CONFIRM_GENERAL,
  },
  {
    id: BTN_ID.CANCEL_GENERAL,
    title: BTN_TITLE.CANCEL_GENERAL,
  },
];

export const BTN_OPT_PAYMENT = [

  {
    id: BTN_ID.PAYMENT_YAPE,
    title: BTN_TITLE.PAYMENT_YAPE,
  },

];

export const BTN_OPT_DATES = [
  {
    id: BTN_ID.CURRENT_DATE,
    title: BTN_TITLE.CURRENT_DATE,
  },
  {
    id: BTN_ID.CURRENT_WEEK,
    title: BTN_TITLE.CURRENT_WEEK,
  },
  {
    id: BTN_ID.CURRENT_MONTH,
    title: BTN_TITLE.CURRENT_MONTH,
  },
];
