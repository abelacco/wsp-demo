import { Injectable } from '@nestjs/common';
import { Message } from 'src/message-cart/entities/message.entity';
import { TextTemplates } from './templates/text.templates';

@Injectable()
export class BuilderTemplatesService {


    buildMessageTemplate(messageUpdated: Message): any {

        messageUpdated.step = messageUpdated.step - 1;
        switch (messageUpdated.step) {
            case 0:
                return TextTemplates.greetings(messageUpdated.clientPhone);
            case 1:
                return TextTemplates.askForDniTemplate(messageUpdated.clientPhone);
            case 2:
                return TextTemplates.dniConfirmationTemplate(messageUpdated.clientPhone);
            case 3:
                return TextTemplates.generateHoursAvaible(messageUpdated.clientPhone);
            case 4:
                return TextTemplates.generatePaymentOptions(messageUpdated.clientPhone);
            case 5:
                return TextTemplates.generateTextAccount(messageUpdated.clientPhone);
            case 6:
                return TextTemplates.verifyingVoucherTemplate(messageUpdated.clientPhone);
            case 7:
                return [
                    TextTemplates.patientConfirmationPayment(messageUpdated.clientPhone),
                    TextTemplates.invoiceTemplate(messageUpdated.clientPhone),
                    // TextTemplates.reminder(messageUpdated.clientPhone),
                    //  TextTemplates.recetaMedica(messageUpdated.clientPhone)

                ]
            default:
                return TextTemplates.greetings(messageUpdated.clientPhone);
        }
    }
}
