import { MODALITY, PACK, PACK_ID, PLAN } from "./constants";

export class Utilities {

    static findPlanDetails(pack_id:string, modality:string) {
        let planSelected = '';
        PACK.forEach(pack => {
            pack.rows.forEach(row => {
                if(row.id === pack_id) {
                    const planPrefix = pack_id.split('_')[0];
                    planSelected = PLAN[planPrefix].PLAN_NAME;
                }
            });
        });
        return planSelected;
    }

    static obtenerPrecioPorPackId(pack_id) {
        // Iterar a través de los valores de PACK_ID para encontrar el objeto correspondiente
        for (const key of Object.keys(PACK_ID)) {
          if (PACK_ID[key].ID === pack_id) {
            return PACK_ID[key].precio; // Retornar el precio cuando se encuentre el ID coincidente
          }
        }
        return null; // Retornar null si no se encuentra el pack_id
      }
}
// const findPlanDetails = (pack_id:string, modality:string) => {
//     let planDetails = {
//       planName: '',
//       modalityName: '',
//       description: '',
//     };
  
//     // Buscar el pack y la modality correspondiente
//     PACK.forEach(pack => {
//       pack.rows.forEach(row => {
//         if(row.id === pack_id) {
//           // Extraer PLAN_NAME basado en el prefijo de pack_id (e.g., MMV, APLV, MLI)
//           const planPrefix = pack_id.split('_')[0];
//           planDetails.planName = PLAN[planPrefix].PLAN_NAME;
  
//           // Si modality es específica, usarla; de lo contrario, usar la title de la row
//           planDetails.modalityName = MODALITY[modality] || row.title;
  
//           // Descripción del paquete
//           planDetails.description = row.description;
//         }
//       });
//     });
  
//     return planDetails;
//   }

