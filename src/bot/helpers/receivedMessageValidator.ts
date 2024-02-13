import { IParsedMessage } from '../entities/messageParsed';
import { WSP_MESSAGE_TYPES } from 'src/common/constants';
import { Message } from 'src/context/entities/message.entity';
import { BTN_ID, STEPS } from 'src/context/helpers/constants';



// En esta función voy a recibir el paso en el que el carrito de compras se encuentra
// Si recibe que el carrito de compras esta en el paso init , entonces el mensaje que reciba debe ser de tipo texto
// Si recibe que el carrito de compras esta en el paso put_dni , entonces el mensaje que reciba debe ser de tipo texto o interactive
// Si recibe que el carrito de compras esta en el paso insert_date , entonces el mensaje que reciba debe ser de tipo texto o interactive
// Si recibe que el carrito de compras esta en el paso select_provider , entonces el mensaje que reciba debe ser de tipo interactive
// Si recibe que el carrito de compras esta en el paso select_payment , entonces el mensaje que reciba debe ser de tipo interactive
// Si recibe que el carrito de compras esta en el paso submit_voucher , entonces el mensaje que reciba debe ser de tipo image
export const receivedMessageValidator = (
  ctx: Message,
  entryMessage: IParsedMessage,
) => {
  let currentStep = ctx.step;
  if( typeof entryMessage.content === 'string' && entryMessage.content.toUpperCase() === 'RESET') {
    return 'cancelAppointmentFlow';
  }
  switch (currentStep) {
    case STEPS.INIT: // Respondo al primer saludo
      if (isTextMessage(entryMessage)) {
        // Debo llamar al servicio para responder
        return 'initFlow';
      }
      // debo llamar al servicio para responder que no es el mensaje esperado
      return 'NOT_VALID';
    case STEPS.CHOOSE_DATE_OPT: // Estoy esperando que selecciones un tipo de gasto
      if (isInteractiveMessage(entryMessage)) {
          if(hasSpecificContentId(entryMessage,BTN_ID.CURRENT_DATE)  ) {
            return 'dateChoosedFlow';
          } else if(hasSpecificContentId(entryMessage,BTN_ID.CURRENT_WEEK) ) {
            return 'weekSelectedFlow';
          }
          else {
            return 'monthSelectedFlow';
          }
      }
      return 'NOT_VALID';
    case STEPS.CHOOSE_HOUR_OPT: // Estoy esperando una confirmación de seguir con la compra
        if(isInteractiveMessage(entryMessage)) {
          return 'paymentOptionFlow';
        }
        return 'NOT_VALID';
    case STEPS.CHOOSE_PAYMENT_OPT: // Estoy esperando que ingreses o confirmes tu DNI
      if (isInteractiveMessage(entryMessage)){
        return 'yapeFlow';
      
      }
        return 'NOT_VALID';
    case STEPS.PROCESS_VOUCHER: // Estoy una imagen del voucher
      if (isImageMessage(entryMessage)) {
        return 'waitingPaymentFlow';
      }
      return 'NOT_VALID';
    case STEPS.WAITING_CONFIRM_PAYMENT: // Estoy esperando que selecciones un paquete
      if (isButtonMessage(entryMessage)) {
        if(hasSpecificTitle(entryMessage,'CONFIRMAR') ) {
          return 'confirmMessageFlow';
        } 
        else {
          return 'getDifferentDateFlow';
        }
      } else if(isTextMessage(entryMessage)) {
        return 'confirmExpenseFlow';
      }
      return 'NOT_VALID';
    case STEPS.DAY_WEEK_SELECTED: // Estoy esperando que seleeciones un dia de la semana
      if (isInteractiveMessage(entryMessage)) {
        return 'dateChoosedFlow';
      }
      return 'NOT_VALID';
    case STEPS.DAY_MONTH_INSERT: // Estoy esperando que ingreses una fecha
      if (isTextMessage(entryMessage)) {
        return 'dateChoosedFlow';
      }
      return 'NOT_VALID';
    default:
      return 'NOT_VALID';
  }
};


// export const isResetMessage = (infoMessage: IParsedMessage): boolean => infoMessage.content.id === ID.RESET;


export const isInteractiveMessage = (infoMessage: IParsedMessage): boolean => infoMessage.type === WSP_MESSAGE_TYPES.INTERACTIVE;

export const isButtonMessage = (infoMessage: IParsedMessage): boolean => infoMessage.type === WSP_MESSAGE_TYPES.BUTTON;

export const isTextMessage = (infoMessage: IParsedMessage): boolean => infoMessage.type ===  WSP_MESSAGE_TYPES.TEXT;

export const isImageMessage = (infoMessage: IParsedMessage): boolean => infoMessage.type === WSP_MESSAGE_TYPES.IMAGE;

export const hasSpecificContentId = (infoMessage: IParsedMessage, expectedId: string): boolean =>  infoMessage.content.id === expectedId;

export const hasSpecificTitle = (infoMessage: IParsedMessage, expectedTitle: string): boolean => infoMessage.content.title.toUpperCase() === expectedTitle;









