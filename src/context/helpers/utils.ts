import { MODALITY, PACK, PACK_ID, PLAN } from "./constants";

export class Utilities {

    static findPlanDetails(pack_id: string, modality: string) {
        let planSelected = '';
        PACK.forEach(pack => {
            pack.rows.forEach(row => {
                if (row.id === pack_id) {
                    const planPrefix = pack_id.split('_')[0];
                    planSelected = PLAN[planPrefix].PLAN_NAME;
                }
            });
        });
        return planSelected;
    }

    static getPriceByPackId(pack_id) {
        // Iterar a través de los valores de PACK_ID para encontrar el objeto correspondiente
        for (const key of Object.keys(PACK_ID)) {
            if (PACK_ID[key].ID === pack_id) {
                return PACK_ID[key].precio; // Retornar el precio cuando se encuentre el ID coincidente
            }
        }
        return null; // Retornar null si no se encuentra el pack_id
    }

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

}


