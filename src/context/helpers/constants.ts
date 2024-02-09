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
        id: 'menu_1',
        title: 'Renovar mi plan',
      },
      {
        id: 'menu_2',
        title: 'Adquiere tu plan',
      }
    ]
  }
];

export const PACK_ID = {
  MMV_INTERCAMBIOS: {
    ID: 'MMV_INTERCAMBIOS',
    precio: 120,
  },
  MMV_SEMANA: {
    ID: 'MMV_SEMANA',
    precio: 200,
  },
  MMV_MES: {
    ID: 'MMV_MES',
    precio: 400,
  },
  APLV_INTERCAMBIOS: {
    ID: 'APLV_INTERCAMBIOS',
    precio: 150,
  },
  APLV_SEMANA: {
    ID: 'APLV_SEMANA',
    precio: 280,
  },
  APLV_MES: {
    ID: 'APLV_MES',
    precio: 500,
  },
  MLI_INTERCAMBIOS: {
    ID: 'MLI_INTERCAMBIOS',
    precio: 150,
  },
  MLI_SEMANA: {
    ID: 'MLI_SEMANA',
    precio: 280,
  },
  MLI_MES: {
    ID: 'MLI_MES',
    precio: 500,
  }
};



export const MODALITY = {
  INTERCAMBIOS: 'INTERCAMBIOS',
  SEMANA: 'SEMANA',
  MES: 'MES',
}

export const PLAN = {
  MMV: 
    {
      PLAN_NAME: 'Mi Mejor Versión',
      WPS_NAME:'Mi Mejor Versión 🧘‍♀️',
    },
  APLV: 
    {
      PLAN_NAME: 'APLV',
      WPS_NAME:'APLV 🤱',
    },
  MLI: 
    {
      PLAN_NAME: 'Mi Luna Interior',
      WPS_NAME:'Mi Luna Interior🌛',
    },
}

export const PACK = [
  {
    title: PLAN.MMV.WPS_NAME,
    rows: [
      {
        id: PACK_ID.MMV_INTERCAMBIOS.ID,
        title: MODALITY.INTERCAMBIOS,
        description: 'Precio: S/. 120',
      },
      {
        id: PACK_ID.MMV_SEMANA.ID,
        title: 'MENÚ SEMANA',
        description: 'Precio: S/. 200',

      },
      {
        id: PACK_ID.MMV_MES.ID,
        title: 'MENÚ MES',
        description: 'Precio: S/. 400',

      }
    ]
  },
  {
    title: PLAN.APLV.WPS_NAME,
    rows: [
      {
        id: PACK_ID.APLV_INTERCAMBIOS.ID,
        title: 'INTERCAMBIOS',
        description: 'Precio: S/. 150',

      },
      {
        id: PACK_ID.APLV_SEMANA.ID,
        title: 'MENÚ SEMANA',
        description: 'Precio: S/. 280',

      },
      {
        id: PACK_ID.APLV_MES.ID,
        title: 'MENÚ MES',
        description: 'Precio: S/. 500',

      }
    ]
  },
  {
    title: PLAN.MLI.WPS_NAME,
    rows: [
      {
        id: PACK_ID.MLI_INTERCAMBIOS.ID,
        title: 'INTERCAMBIOS',
        description: 'Precio: S/. 150',

      },
      {
        id: PACK_ID.MLI_SEMANA.ID,
        title: 'MENÚ SEMANA',
        description: 'Precio: S/. 280',

      },
      {
        id: PACK_ID.MLI_MES.ID,
        title: 'MENÚ MES',
        description: 'Precio: S/. 500',

      }
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
  CHOOSE_MENU_OPT: '1',
  CONTINUE_PURCHASE: '2',
  PUT_DNI: '3',
  CHOOSE_PACK_OPT: '4',
  PROVIDER_PAYMENT_SELECTED: '5',
  SUBMIT_VOUCHER: '6',
  CONFIRM_PAYMENT: '7',
  SEND_CONFIRMATION: '8',
  INFO_FOR_NEW_PROVIDER: '9',
};

// MENSAJES Y ID DE MENSAJES INTERACTIVOS

export const TITLE_INT_BTN = {
  INTRODUCTION_TEMPLATE_A1: 'Buscar cuarto 🛏️',
  INTRODUCTION_TEMPLATE_A2: '⚕️ Soy Hotel',
  RESET_TEMPLATE: 'Reset',
  CONFIRMATION_ANSWER: 'Confirmar ✅',
  TRY_AGAIN_ANSWER: 'Volver a intentar 👀',
  CHOOSE_ANOTHER_ANSWER: 'Elegir otro 🔄',
  CHOOSE_ANOTHER_DATE_ANSWER: 'Otra fecha 📅',
  SELECT_PROVIDER: 'Reservar cuarto 🛒',
  ACCEPT: 'Aceptar ✅',
  GREETING: ['Hola', 'Necesito ayuda'],
  ACCEPT_APPOINTMENT: 'Aceptar',
  PAYMENTS_OPTIONS: ['Tarjeta 💳', 'Yape/Plin 📱', 'Efectivo'],
  SUBMIT_VOUCHER: 'Listo',
  PROVIDER_ACCEPT: 'Aceptar ✅',
}


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
}

export const BTN_TITLE = {
  ACCEPT_DNI: 'Confirmar ✅',
  RETRY_DNI: 'Volver a intentar 👀',
  CONFIRM_GENERAL: '✅ Continuar',
  CANCEL_GENERAL: '❌ Cancelar',
  PAYMENT_YAPE: 'Yape/Plin 📱',
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