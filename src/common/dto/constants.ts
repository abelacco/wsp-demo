// WASAP MESSAGE TYPES
export const WSP_MESSAGE_TYPES = {
  TEXT: 'text',
  INTERACTIVE: 'interactive',
  IMAGE: 'image',
  BUTTON: 'button'
};

export const INTERACTIVE_REPLIES_TYPES = {
  BUTTON_REPLY: 'button_reply',
  LIST_REPLY: 'list_reply',
};

//DATA PROPIA DE LA APLICACION
export const SPECIALITIES_LIST = [
    {
      id: '1',
      title: 'Nutrición',
    },
    {
      id: '2',
      title: 'Odontología',
    },
    {
      id: '3',
      title: 'Oftalmología',
    },
    {
      id: '4',
      title: 'Ginecología',
    },
    {
      id: '5',
      title: 'Medicina General',  
    },
    {
        id: '6',
        title: 'Pediatría',
    },
    {
        id: '7',
        title: 'Psicología',
    },
    {
        id: '8',
        title: 'Cardiología',
    },
    {
        id: '9',
        title: 'Dermatología',
    },
    {
        id: '10',
        title: 'Ver más',
    },
   
  ];

  export const DOCTOR_LIST = [
    {
      id: '1',
      title: 'Pedro Perez Carrasco',
    },
    {
      id: '2',
      title: 'Patricia Perez Carrasco',
    },
    {
      id: '3',
      title: 'Juan Perez Carrasco',
    },
    {
      id: '4',
      title: 'Maria Perez Carrasco',
    },
    {
      id: '5',
      title: 'Jose Perez Carrasco',  
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
  INIT: 0,
  SEND_GREETINGS: 1,
  PUT_DNI: 2,
  INSERT_DATE: 3,
  SELECT_PROVIDER: 4,
  SELECT_PAYMENT: 5,
  SUBMIT_VOUCHER: 6,
  SEND_CONFIRMATION: 7,
  INFO_FOR_NEW_PROVIDER: 8,
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

