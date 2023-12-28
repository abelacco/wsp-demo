import { DOCTOR_LIST, SCHUDULE_LIST, SPECIALITIES_LIST, TITLE_INT_BTN } from "src/common/dto/constants";


export class TextTemplates {


    static greetings(phone: string) {
        return {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: {
                    text: `¡Hola soy Caro, yo te ayudaré a encontrar un especialista en solo unos minutos 👩‍⚕️🚀  \n\n¿Cómo podemos ayudarte hoy?\n\n**ESTO ES UNA DEMO LOS MENSAJES SON SECUENCIALES Y LA INFORMACIÓN BRINDAD NO ES REAL**
              `,
                },
                action: {
                    buttons: [
                        {
                            type: 'reply',
                            reply: {
                                id: 'see_specialities_button_id',
                                title: '📆 Agendar una cita',
                            },
                        },
                        {
                            type: 'reply',
                            reply: {
                                id: 'specialist_button_id',
                                title: 'Mayor información',
                            },
                        },
                    ],
                },
            },
        };
    }

    static askForDniTemplate(phone: string) {
        return {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'text',
            text: {
                body: '¡Genial! Por favor, ingresa tu DNI para registrarte ✅',
            },
        };
    }

    static dniConfirmationTemplate(phone: string) {
        return {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: {
                    text: `¿Eres ROBERTO DIONISIO SUAREZ PULACHE?`,
                },
                action: {
                    buttons: [
                        {
                            type: 'reply',
                            reply: {
                                id: 'accpt_dni',
                                title: 'Confirmar ✅',
                            },
                        },
                        {
                            type: 'reply',
                            reply: {
                                id: 'retry_dni',
                                title: 'Volver a intentar 👀',
                            },
                        },
                    ],
                },
            },
        };
    }

    static generateSpecialitiesList(phone: string) {
        return {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'interactive',
            interactive: {
                type: 'list',
                header: {
                    type: 'text',
                    text: 'Lista de especialidades 📋',
                },
                body: {
                    text: 'Puedes elegir una de las siguientes especialidades o escribir el nombre de la especialidad que deseas',
                },
                footer: {
                    text: 'Escribir ayuda para atención personalizada',
                },
                action: {
                    button: 'Ver especialidades 🔎',
                    sections: [
                        {
                            title: 'Especialidades',
                            rows: SPECIALITIES_LIST
                        },
                    ],
                },
            },
        };
    }

    static generateDoctorList(phone: string) {
        return {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'interactive',
            interactive: {
                type: 'list',
                header: {
                    type: 'text',
                    text: 'Lista de doctores 📋',
                },
                body: {
                    text: 'Puedes elegir uno de los siguientes doctores',
                },
                footer: {
                    text: 'Escribir ayuda para atención personalizada',
                },
                action: {
                    button: 'Ver Doctores 🔎',
                    sections: [
                        {
                            title: 'Doctores',
                            rows: DOCTOR_LIST
                        },
                    ],
                },
            },
        };
    }

    static selectHoursOptions(phone: string) {
        return {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: {
                    text: `Puedes buscar  disponibilidad por lo más pronto o por un día específico`,
                },
                action: {
                    buttons: [
                        {
                            type: 'reply',
                            reply: {
                                id: 'accpt_dni',
                                title: 'Lo más pronto 🕐',
                            },
                        },
                        {
                            type: 'reply',
                            reply: {
                                id: 'retry_dni',
                                title: 'Por día 📅',
                            },
                        },
                    ],
                },
            },
        };
    }

    static generateHoursAvaible(phone: string) {
        return {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'interactive',
            interactive: {
                type: 'list',
                header: {
                    type: 'text',
                    text: 'Horarios disponibles 📋',
                },
                body: {
                    text: 'Puedes elegir uno de los siguientes horarios',
                },
                footer: {
                    text: 'Escribir ayuda para atención personalizada',
                },
                action: {
                    button: 'Ver Horarios 🔎',
                    sections: [
                        {
                            title: 'Horarios',
                            rows: SCHUDULE_LIST
                        },
                    ],
                },
            },
        };
    }
    

    static generatePaymentOptions(phone: string) {
        return {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: {
                    text: 'Y ya para terminar, escoge tu medio de pago 🙌',
                },
                action: {
                    buttons: [
                        {
                            type: 'reply',
                            reply: {
                                id: 'UNIQUE_BUTTON_ID_1',
                                title: TITLE_INT_BTN.PAYMENTS_OPTIONS[0],
                            },
                        },
                        {
                          type: 'reply',
                          reply: {
                            id: 'UNIQUE_BUTTON_ID_2',
                            title: TITLE_INT_BTN.PAYMENTS_OPTIONS[1],
                          },
                        },
                        {
                            type: 'reply',
                            reply: {
                              id: 'UNIQUE_BUTTON_ID_2',
                              title: TITLE_INT_BTN.PAYMENTS_OPTIONS[2],
                            },
                          }
                    ],
                },
            },
        };
    }

    static generateTextAccount(phone: string) {
        return {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'text',
            text: {
                body: '☝️ Para terminar, por favor realizar el yape al 99999999 a nombre de Caritas Felices \n\n**ESTO ES UNA DEMO, ESCRIBIR 1 PARA SEGUIR**',
            },
        };
    }


    static verifyingVoucherTemplate(phone: string) {
        return {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'text',
            text: {
                body: 'Estamos verificando tu comprobante de pago, un minuto por favor! 🙌',
            },
        };
    }


    static askForModalityTemplate(phone: string) {
        return {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: {
                    text: `¿Que modalidad prefieres para la cita?`,
                },
                action: {
                    buttons: [
                        {
                            type: 'reply',
                            reply: {
                                id: 'select_on_site_id',
                                title: 'Presencial',
                            },
                        },
                        {
                            type: 'reply',
                            reply: {
                                id: 'select_remote_id',
                                title: 'Online',
                            },
                        },
                    ],
                },
            },
        };
    }



    static defaultMessageTemplate(phone: string) {
        return {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'text',
            text: {
                body: '⛔ No es lo que esperaba, vuelve a intentar',
            },
        };
    }

    static resetQuestions(phone: string) {
        return {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: {
                    text: 'Has tenido varios inconvenientes, puedes reiniciar el proceso siempre que quieras escribiendo "Reset"',
                },
                action: {
                    buttons: [
                        {
                            type: 'reply',
                            reply: {
                                id: 'button_reset_id',
                                title: 'Reset',
                            },
                        },
                    ],
                },
            },
        };
    }












    static doctorConfirmation(phone: string, docName: string, fee: number, date: string) {
        return {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: {
                    text: `Por favor, confirma tu cita: \n\nDoctor: ${docName} \nTurno: ${date} \nCosto: S/ ${fee}`,
                },
                action: {
                    buttons: [
                        {
                            type: 'reply',
                            reply: {
                                id: 'accpt_doctor',
                                title: 'Confirmar ✅',
                            },
                        },
                        {
                            type: 'reply',
                            reply: {
                                id: 'retry_doctor',
                                title: 'Elegir Otro 🔄',
                            },
                        },
                    ],
                },
            },
        };
    }

    static dateConfirmation(phone: string, date: string) {
        return {
            messaging_product: 'whatsapp',
            to: phone,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: {
                    text: `¿Confirma la fecha y hora: ${date}? 👀`,
                },
                action: {
                    buttons: [
                        {
                            type: 'reply',
                            reply: {
                                id: 'accpt_date',
                                title: 'Confirmar ✅',
                            },
                        },
                        {
                            type: 'reply',
                            reply: {
                                id: 'retry_date',
                                title: 'Elegir otra 🤔',
                            },
                        },
                    ],
                },
            },
        };
    }

    static patientConfirmationPayment(appointment: any) {
        const { code, date, fee, patientId, doctorId } = appointment;
        const { name: docName, speciality, phone: doctorPhone, office } = doctorId;
        const { phone: patientPhone, name: patientName } = patientId;
        const dateString = '21/01/2021 10:00 am';
        return {
            messaging_product: 'whatsapp',
            to: patientPhone,
            type: 'text',
            text: {
                body: `✅ ¡Gracias por reservar con el Dr. ${docName}! 🧑‍⚕️ \n\nA continuación, los datos de tu cita. 🙌
        Paciente: ${patientName}
        Especialidad: ${speciality}
        Fecha y Hora de la cita: ${dateString}
        Modalidad: 
        Consultorio: ${office}
        Costo de la cita: S/${fee}
        Celular Doctor: ${doctorPhone}
        Identificación: ${code} \n\nMuchas gracias por reservar con Doctor Qali💯 \n\n Para mayor información acerca de la cita deberá contactar directamente con el doctor al siguiente número ${doctorPhone}`,
            },
        };
    }










}

