import { Logger } from '@nestjs/common';
import { IParsedMessage } from '../entities/messageParsed';
import { BTN_ID, PACK_ID, STEPS } from './constants';
import { WSP_MESSAGE_TYPES } from 'src/common/constants';
import { Message } from '../entities/message.entity';
import e from 'express';
import { iif } from 'rxjs';



// En esta función voy a recibir el paso en el que el carrito de compras se encuentra
// Si recibe que el carrito de compras esta en el paso init , entonces el mensaje que reciba debe ser de tipo texto
// Si recibe que el carrito de compras esta en el paso put_dni , entonces el mensaje que reciba debe ser de tipo texto o interactive
// Si recibe que el carrito de compras esta en el paso insert_date , entonces el mensaje que reciba debe ser de tipo texto o interactive
// Si recibe que el carrito de compras esta en el paso select_provider , entonces el mensaje que reciba debe ser de tipo interactive
// Si recibe que el carrito de compras esta en el paso select_payment , entonces el mensaje que reciba debe ser de tipo interactive
// Si recibe que el carrito de compras esta en el paso submit_voucher , entonces el mensaje que reciba debe ser de tipo image
export const receivedMessageValidator = (
  currentStep: number,
  entryMessage: IParsedMessage,
) => {
  switch (currentStep) {
    case STEPS.INIT: // Respondo al primer saludo
      if (isTextMessage(entryMessage)) {
        // Debo llamar al servicio para responder
        return 'initFlow';
      }
      // debo llamar al servicio para responder que no es el mensaje esperado
      return 'NOT_VALID';
    case STEPS.CHOOSE_MENU_OPT: // Estoy esperando una opcion del menu
      if (isInteractiveMessage(entryMessage)) {
        switch (entryMessage.content.id) {
          case 'menu_0':
            return 'servicesFlow';
          case 'menu_1':
            return 'renovationPathFlow';
          case 'menu_2':
            return 'choosePackFlow';
          // case '3':
          //   return 'recipePathFlow';
          default:
            return 'NOT_VALID';
        }
      }
      return 'NOT_VALID';
    case STEPS.CONTINUE_PURCHASE: // Estoy esperando una confirmación de seguir con la compra
        if(isInteractiveMessage(entryMessage) && hasSpecificContentId(entryMessage,BTN_ID.CONFIRM_GENERAL) ) {
          return 'askDniFlow'; // Si es continuar con la compra, pido el DNI
        }
        return 'NOT_VALID';
    case STEPS.PUT_DNI: // Estoy esperando que ingreses o confirmes tu DNI
      if (isTextMessage(entryMessage)){
        return 'confirmDniFlow';
      
      }
      else if (isInteractiveMessage(entryMessage)) {
        if (hasSpecificContentId(entryMessage,BTN_ID.ACCEPT_DNI)  ) {
          return 'choosePackFlow';
        }else if (hasSpecificContentId(entryMessage,BTN_ID.RETRY_DNI) ) {
          return 'retryAskDniFlow';
        } else {
          return 'NOT_VALID';
        }
      }
      else {
        return 'NOT_VALID';
      }
      case STEPS.CHOOSE_PACK_OPT: // Estoy esperando que selecciones un paquete
      if (isInteractiveMessage(entryMessage)) {
        let packSelected = false;
        for (const id of Object.values(PACK_ID)) {
          if (hasSpecificContentId(entryMessage, id)) {
            packSelected = true;
            break; // Salir del bucle una vez que encuentres un ID coincidente
          }
        }
        if (packSelected) {
          return 'choosePaymentFlow';
        } else {
          return 'NOT_VALID';
        }
      }
    return 'NOT_VALID';
    case STEPS.PROVIDER_PAYMENT_SELECTED: // Estoy esperando que selecciones un proveedor de pago
      if(isInteractiveMessage(entryMessage) && hasSpecificContentId(entryMessage,BTN_ID.PAYMENT_YAPE) ) {
        return 'submitVoucherFlow';
      } else {
        return 'NOT_VALID';
      }
    case STEPS.SUBMIT_VOUCHER: // Estoy esperando que envies el comprobante de pago
      if(isImageMessage(entryMessage)) {
        return 'waitingPaymentFlow';
      }
      return 'NOT_VALID';
    // case STEPS.INSERT_DATE:
    //   if (isTextMessage(entryMessage) ||
    //       (hasSpecificContentId(entryMessage,ID.CHOOSE_ANOTHER)   ||
    //         hasSpecificContentId(entryMessage,ID.ACCEPT_DATE)  
    //       )
    //     ) {
    //     return true;
    //   }
    //   return false;
    // case STEPS.SELECT_PROVIDER:
    //   if (
    //     isInteractiveMessage(entryMessage) &&
    //     (entryMessage.content.title === REPLIES_BUTTONS.SELECT_PROVIDER ||
    //       hasSpecificContentId(entryMessage,ID.ACEPT_PROVIDER)   ||
    //       hasSpecificContentId(entryMessage,ID.CHOOSE_ANOTHER) )
    //   ) {
    //     return true;
    //   }
    //   return false;
    // case STEPS.SELECT_PAYMENT:
    //   if (
    //     isInteractiveMessage(entryMessage) &&
    //     REPLIES_BUTTONS.PAYMENTS_OPTIONS.some((opt) => opt === entryMessage.content.title)
    //   ) {
    //     return true;
    //   }
    //   return false;
    // case STEPS.SUBMIT_VOUCHER:
      // if (entryMessage.type === WSP_MESSAGE_TYPES.IMAGE) {
      //   return true;
      // }
      // return false;
    default:
      return 'NOT_VALID';
  }
};

export const ProviderMessageValidator = (infoMessage: IParsedMessage) => {
  // Logger.log('INIT PROVIDER MESSAGE VALIDATOR', 'MESSAGE');
  // if (
  //   isButtonMessage(infoMessage) &&
  //   infoMessage.content.title === REPLIES_BUTTONS.PROVIDER_ACCEPT &&
  //   infoMessage.content.payload?.split('-')[0] === ID.PROVIDER_ACCEPT_ID
  // ) {
  //   Logger.log('IS PROVIDER MESSAGE', 'MESSAGE');
  //   return true;
  // }
  // Logger.log('NOT PROVIDER MESSAGE', 'MESSAGE');
  // return false;
};

// export const isResetMessage = (infoMessage: IParsedMessage): boolean => infoMessage.content.id === ID.RESET;


export const isInteractiveMessage = (infoMessage: IParsedMessage): boolean => infoMessage.type === WSP_MESSAGE_TYPES.INTERACTIVE;

export const isButtonMessage = (infoMessage: IParsedMessage): boolean => infoMessage.type === WSP_MESSAGE_TYPES.BUTTON;

export const isTextMessage = (infoMessage: IParsedMessage): boolean => infoMessage.type ===  WSP_MESSAGE_TYPES.TEXT;

export const isImageMessage = (infoMessage: IParsedMessage): boolean => infoMessage.type === WSP_MESSAGE_TYPES.IMAGE;

export const hasSpecificContentId = (infoMessage: IParsedMessage, expectedId: string): boolean =>  infoMessage.content.id === expectedId;

export const hasSpecificTitle = (infoMessage: IParsedMessage, expectedTitle: string): boolean => infoMessage.content.title.toUpperCase() === expectedTitle;

// export const hasSpecificContentType = (infoMessage: IParsedMessage, expectedType: string): boolean => infoMessage.type === expectedType;

export const clientHasDni = (lastMessageCart: Message): boolean => lastMessageCart.dni !== null;

export const isResetMessage = (entryMessage: IParsedMessage): boolean => {
  // if (isTextMessage(entryMessage)) {
  //     // Si es un mensaje de texto, verifica si el contenido incluye la palabra 'RESET'
  //     const contentUpperCase = entryMessage.content.toUpperCase();
  //     return contentUpperCase === SPECIAL_WORDS.RESET;
  // } else if (isInteractiveMessage(entryMessage)) {
  //     // Si es un mensaje interactivo, verifica si el ID y el título son los esperados
  //     return entryMessage.content.id === ID.RESET && 
  //            entryMessage.content.title === REPLIES_BUTTONS.RESET_TEMPLATE;
  // }
  return false;
};




