import { Injectable } from '@nestjs/common';
import { Message } from 'src/message-cart/entities/message.entity';
import { TextTemplates } from './templates/text.templates';
import { ButtonReply, InteractiveButtonMessage, InteractiveListMessage, InteractiveListSection, TextMessage } from 'src/message-cart/interface';

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
                return [TextTemplates.planesNutricionales(messageUpdated.clientPhone),
                TextTemplates.confirmAntesDeEscogerPlan(messageUpdated.clientPhone)];
            case 4:
                return TextTemplates.cupoDisponible(messageUpdated.clientPhone);
            case 5:
                return TextTemplates.listaPlanes(messageUpdated.clientPhone);
            case 6:
                return TextTemplates.tipoPlan(messageUpdated.clientPhone);
            case 7:
                return TextTemplates.generatePaymentOptions(messageUpdated.clientPhone);
            case 8:
                return TextTemplates.generateTextAccount(messageUpdated.clientPhone);
            case 9:
                return TextTemplates.verifyingVoucherTemplate(messageUpdated.clientPhone);
            case 10:
                return [TextTemplates.patientConfirmationPayment(messageUpdated.clientPhone),
                TextTemplates.AboutOurServices(messageUpdated.clientPhone)];
            case 11:
                return TextTemplates.AboutOurServices(messageUpdated.clientPhone);
            default:
                return TextTemplates.greetings(messageUpdated.clientPhone);
        }
    }

    buildTextMessage(phoneNumber: string, bodyText: string): TextMessage {
        return {
            messaging_product: 'whatsapp',
            to: phoneNumber,
            type: 'text',
            text: {
                body: bodyText,
            },
        };
    }

    buildInteractiveListMessage(phoneNumber: string,
        buttonText: string,
        sections: InteractiveListSection[],
        headerText?: string,
        bodyText?: string,
        footerText?: string,): InteractiveListMessage {
        const interactive: InteractiveListMessage['interactive'] = {
            type: "list",
            action: { button: buttonText, sections }
        };

        if (headerText) {
            interactive.header = { type: "text", text: headerText };
        }

        if (bodyText) {
            interactive.body = { text: bodyText };
        }

        if (footerText) {
            interactive.footer = { text: footerText };
        }

        return {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: phoneNumber,
            type: "interactive",
            interactive
        }
    }
    buildInteractiveButtonMessage(
        phoneNumber: string,
        bodyText: string,
        buttons: ButtonReply[]
    ): InteractiveButtonMessage {
        // Validamos que no se incluyan más de 3 botones
        if (buttons.length > 3) {
            throw new Error('No se pueden incluir más de 3 botones.');
        }

        return {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: phoneNumber,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: {
                    text: bodyText
                },
                action: {
                    buttons: buttons.map(button => ({
                        type: 'reply',
                        reply: button
                    }))
                }
            }
        };
    }

    buildMultimediaMessage(
        to: string,
        type: 'audio' | 'document' | 'image' | 'sticker' | 'video',
        options: {
            id?: string;
            link: string;
            caption?: string;
            filename?: string;
            provider?: string;
        }
    ): MultimediaMessage {
        // Validar que si el tipo es distinto de 'text', se debe proporcionar o 'id' o 'link'.
        if (!options.id && !options.link) {
            throw new Error("Se requiere 'id' o 'link' para mensajes multimedia.");
        }

        const message: MultimediaMessage = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: type,
            [type]: {
                ...(options.id && { id: options.id }),
                link: options.link,
                ...(options.caption && { caption: options.caption }),
                ...(type === 'document' && options.filename && { filename: options.filename }),
                ...(options.provider && { provider: options.provider }),
            },
        };

        return message;
    }

     buildTemplateMessage(phoneNumber: string, templateName: string, languageCode: string, headerImageUrl: string | undefined, bodyTexts: string[]): TemplateMessage {
        const components: TemplateComponent[] = [];

        // Añadir header con imagen si se proporciona
        if (headerImageUrl) {
            components.push({
                type: 'header',
                parameters: [{
                    type: 'image',
                    image: { link: headerImageUrl }
                }]
            });
        }

        // Añadir body con parámetros de texto
        const bodyParameters: TemplateTextParameter[] = bodyTexts.map(text => ({
            type: 'text',
            text: text
        }));

        if (bodyParameters.length > 0) {
            components.push({
                type: 'body',
                parameters: bodyParameters
            });
        }

        return {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: phoneNumber,
            type: 'template',
            template: {
                name: templateName,
                language: {
                    code: languageCode
                },
                components: components
            }
        };
    }
          

}
