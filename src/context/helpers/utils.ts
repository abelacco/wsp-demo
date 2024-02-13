import { InteractiveListSection } from "src/builder-templates/interface";
import * as moment from 'moment';
export class Utilities {

    // static findPlanDetails(pack_id: string, modality: string) {
    //     let planSelected = '';
    //     PACK.forEach(pack => {
    //         pack.rows.forEach(row => {
    //             if (row.id === pack_id) {
    //                 const planPrefix = pack_id.split('_')[0];
    //                 planSelected = PLAN[planPrefix].PLAN_NAME;
    //             }
    //         });
    //     });
    //     return planSelected;
    // }

    // static getPriceByPackId(pack_id) {
    //     // Iterar a través de los valores de PACK_ID para encontrar el objeto correspondiente
    //     for (const key of Object.keys(PACK_ID)) {
    //         if (PACK_ID[key].ID === pack_id) {
    //             return PACK_ID[key].precio; // Retornar el precio cuando se encuentre el ID coincidente
    //         }
    //     }
    //     return null; // Retornar null si no se encuentra el pack_id
    // }

    static parseFullName(texto) {
        if (!texto) return texto; // Retorna el texto tal cual si es nulo o vacío

        // Convierte todo el texto a minúsculas y luego capitaliza la primera letra.
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    }

    static getFirstName(fullName) {
        return this.parseFullName(fullName.split(' ')[0]);
    }

    static today() {
        const today = new Date();
        const todayString = today.toLocaleDateString('es-PE');
        return todayString;
    }

    static getMonth() {
        const today = new Date();
        const month = today.getMonth() + 1; // getMonth() devuelve un valor de 0 a 11, por lo que se suma 1
        return String(month).padStart(2, '0'); // Asegura que el mes siempre tenga dos dígitos
    }


    static generateOneSectionTemplate(menuTitle: string, items: any): InteractiveListSection[] {
        return [
            {
                title: menuTitle,
                rows: items.map((item: any, index: any) => ({
                    id: `${item.rowHour}`,
                    title: item.clientHour,
                    description: item.normalHour,
                    // description: `Límite: ${item.limit}`,
                })),
            }
        ]
    }

    static generateWeekListTemplate(menuTitle: string, items: any): InteractiveListSection[] {
        return [
            {
                title: menuTitle,
                rows: items.map((item: any, index: any) => ({
                    id: `${item.id}`,
                    title: `${item.title} ${item.id}`,
                    // description: item.normalHour,
                    // description: `Límite: ${item.limit}`,
                })),
            }
        ]
    }

    static async isDatePast(fechaConsulta: string): Promise<boolean> {
        // Obtener la hora actual considerando la zona horaria de Perú
        const offsetPeru = -5; // UTC-5 para Perú
        const nowUTC = new Date(new Date().toUTCString());
        const ahoraPeru = new Date(nowUTC.setHours(nowUTC.getHours() + offsetPeru));

        // Formatear la fecha actual a YYYY-MM-DD para comparación
        const fechaActual = ahoraPeru.toISOString().split('T')[0];

        // Convertir la fecha de consulta a formato YYYY-MM-DD para asegurar una comparación correcta
        const [dia, mes, año] = fechaConsulta.split('/');
        const fechaConsultaFormat = `${año}-${mes}-${dia}`;

        // Comparar si la fecha de consulta es anterior a la fecha actual
        return fechaConsultaFormat < fechaActual;
    }

    static getTodayDate() {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0'); // Adds a zero if needed to ensure it's two digits
        const month = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() returns a value between 0 and 11, so add 1
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;
    }

    static getTomorrowDate() {
        const today = new Date();
        today.setDate(today.getDate() + 1); // Increment the day by 1
        const day = String(today.getDate()).padStart(2, '0'); // Adds a zero if needed to ensure it's two digits
        const month = String(today.getMonth() + 1).padStart(2, '0'); // getMonth() returns a value between 0 and 11, so add 1
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;
    }

    static transformHours(hoursArray) {
        return hoursArray.map(hour => {
            // Calcula el equivalente en horas de 12 horas para 'clientHour' y 'normalHour'
            const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

            // Determina si es AM o PM para 'clientHour' y 'normalHour'
            const amPm = hour >= 12 ? 'p.m' : 'a.m';

            // Formatea las horas para 'normalHour' y 'clientHour'
            const normalHour = `${String(hour).padStart(2, '0')}:00 ${amPm}`;
            const clientHour = `${hour12}:00 ${amPm}`;

            // Retorna el nuevo objeto con las propiedades formateadas
            return {
                normalHour,
                clientHour,
                rowHour: hour
            };
        });
    }

    // async generateWeekButtons() {
    //     const today = new Date();
    //     const day = today.getDay();
    //     const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    //     const week = [];

    //     for (let i = 0; i < 7; i++) {
    //         const nextDay = new Date(today);
    //         nextDay.setDate(today.getDate() + i);
    //         const dayNumber = nextDay.getDate();
    //         const dayName = days[nextDay.getDay()];
    //         week.push({ id: dayNumber, title: dayName });
    //     }

    //     return week;
    // }
    static generateWeekButtons() {
        const today = moment().startOf('day'); // Comienza al inicio del día actual
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const week = [];
    
        for (let i = 0; i < 7; i++) {
            const nextDay = moment(today).add(i, 'days');
    
            // Solo añade el día si es hoy o está en el futuro
            if (nextDay.isSameOrAfter(today, 'day')) {
                const dayNumber = nextDay.format('DD/MM/YYYY'); // Formatea la fecha como DD/MM/YYYY
                const dayName = days[nextDay.day()];
                week.push({ id: dayNumber, title: dayName });
            }
        }
    
        return week;
    }


static getDateFromDay(day: string): string {
  // Asume que el día es del mes y año actuales
  const formattedDay = day.padStart(2, '0'); // Asegura que el día tenga dos dígitos
  const date = moment().date(parseInt(formattedDay)).format('DD/MM/YYYY');

  return date;
}

static getLatestTenItems(array) {
    // Si el array tiene 10 o menos elementos, lo devuelve tal cual
    if (array.length <= 10) {
      return array;
    }
    // Si el array tiene más de 10 elementos, devuelve los últimos 10
    return array.slice(-10);
  }

    

}


