import { Injectable } from '@nestjs/common';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import moment from 'moment-timezone';
@Injectable()
export class GoogleSpreadsheetService {
  private doc: GoogleSpreadsheet;
  private jwtClient: JWT;

  constructor() {
    const sheetId = process.env.SHEET_ID;  
    if (!sheetId) {
      throw new Error('Sheet ID is required');
    }
    this.jwtClient = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ]
      
    });

    this.doc = new GoogleSpreadsheet(sheetId, this.jwtClient); // Pass the auth argument
  }

    /**
   * Inserta datos en una hoja específica dentro de la hoja de cálculo.
   * 
   * @param sheetIndex Índice de la hoja donde se insertarán los datos (basado en 0).
   * @param rowData Datos a insertar en la hoja. Debe ser un objeto donde las claves corresponden a los encabezados de las columnas.
   */
    async insertData(sheetIndex: number, rowData: any): Promise<void> {
      try {
        await this.doc.loadInfo(); // Carga la información de la hoja de cálculo
        const sheet = this.doc.sheetsByIndex[sheetIndex]; // Obtiene la hoja por índice
        // const headers = await sheet.loadHeaderRow();
        // console.log('Headers:', headers);
        // Inserta la fila en la hoja
        await sheet.addRow(rowData);
      } catch (error) {
        console.error('Error al insertar datos en Google Sheets:', error);
        throw new Error('Failed to insert data into Google Sheets');
      }
    }


    async getAvailableDay(): Promise<string> {
      try {
        await this.doc.loadInfo();
        const sheet = this.doc.sheetsByIndex[0];
        const rows: any = await sheet.getRows();
    
        const shiftsByDate = {};
        rows.forEach(row => {
          const fecha = row._rawData[1]; // Asume que esta es la fecha en formato DD/MM/YYYY
          if (shiftsByDate[fecha]) {
            shiftsByDate[fecha].push(row);
          } else {
            shiftsByDate[fecha] = [row];
          }
        });
    
        const sortedDates = Object.keys(shiftsByDate).sort((a, b) => {
          const [dayA, monthA, yearA] = a.split("/").map(Number);
          const [dayB, monthB, yearB] = b.split("/").map(Number);
          return new Date(yearA, monthA - 1, dayA).valueOf() - new Date(yearB, monthB - 1, dayB).valueOf();
        });
    
        let nextAvailableDate = sortedDates.find(date => shiftsByDate[date].length < 4);
    
        if (!nextAvailableDate && sortedDates.length > 0) {
          // Calcula manualmente el próximo día disponible basado en la última fecha de sortedDates
          const [lastDay, lastMonth, lastYear] = sortedDates[sortedDates.length - 1].split("/").map(Number);
          let nextDay = new Date(lastYear, lastMonth - 1, lastDay + 1); // Añade un día a la última fecha registrada
          const dd = String(nextDay.getDate()).padStart(2, '0');
          const mm = String(nextDay.getMonth() + 1).padStart(2, '0'); //Enero es 0
          const yyyy = nextDay.getFullYear();
          nextAvailableDate = `${dd}/${mm}/${yyyy}`;
        }
    
        // Si todas las fechas están llenas o no hay fechas registradas, asigna el día actual como disponible
        if (!nextAvailableDate) {
          const today = new Date();
          const dd = String(today.getDate()).padStart(2, '0');
          const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0
          const yyyy = today.getFullYear();
          nextAvailableDate = `${dd}/${mm}/${yyyy}`;
        }
    
        return nextAvailableDate;
      } catch (error) {
        console.error('Error retrieving the next available day:', error);
        throw new Error('Failed to retrieve the next available day');
      }
    }
    
    async getExpenseTypeWithLimits(): Promise<any[]> {
      try {
        await this.doc.loadInfo(); // Carga la información de la hoja de cálculo
        const sheet = this.doc.sheetsByTitle['partidas']; // Accede a la hoja por su título
        if (!sheet) {
          throw new Error('La hoja de Partidas no se encuentra en el documento.');
        }
        const rows:any = await sheet.getRows(); // Obtiene todas las filas de la hoja 'Partidas'
    
        // Transforma las filas en un array de objetos con la información relevante
        const partidasWithLimits = rows.map(row => {
          console.log(row._rawData);
          return {
            expenseType: row._rawData[0], // Accede a la propiedad 'partida' utilizando la notación de corchetes
            limit: row._rawData[1], // Accede a la propiedad 'limite' utilizando la notación de corchetes
          };
        });
    
        return partidasWithLimits;
      } catch (error) {
        console.error('Error al recuperar las partidas con límites:', error);
        throw new Error('Failed to retrieve partidas with limits');
      }
    }

    async getAccumulatedByExpense( expenseType:string,month: string, year:string ='24'): Promise<any[]> {
      try {
        await this.doc.loadInfo(); // Carga la información de la hoja de cálculo
        const sheet = this.doc.sheetsByTitle['egresos']; // Reemplaza con el título real de tu hoja
        const rows:any = await sheet.getRows(); // Obtiene todas las filas de la hoja
    
        const filteredRows = rows.filter(row => {
          const fechaEgreso = row._rawData[1]; // Asume que esta es la fecha en formato DD/MM/YYYY         
          const [day, monthRow, yearRow] = fechaEgreso.split('/').map(String);
          const matchesExpenses = expenseType ? row._rawData[2] === expenseType : true;
          return monthRow === month && yearRow === year && matchesExpenses;
        });
        console.log(filteredRows);
        const accumulatedByPartida = filteredRows.reduce((acc, row) => {
          const expenseType = row._rawData[2];
          const total = parseFloat(row._rawData[4]) || 0; // Asegúrate de convertir el total a número
    
          if (!acc[expenseType]) {
            acc[expenseType] = { expenseType, total: 0 };
          }
    
          acc[expenseType].total += total;
          return acc;
        }, {});
    
        // Convertir el objeto acumulado a un array de objetos
        return Object.values(accumulatedByPartida);
      } catch (error) {
        console.error('Error al recuperar los acumulados por partida:', error);
        throw new Error('Failed to retrieve accumulated by partida');
      }
    }

    async getUser(phoneNumber: string): Promise<{name: string, phoneNumber: string} | null> {
      try {
        await this.doc.loadInfo(); // Load the spreadsheet information
        const sheet = this.doc.sheetsByTitle['colab']; // Access the sheet by its title
        if (!sheet) {
          throw new Error('The sheet "colab" is not found in the document.');
        }
        const rows:any = await sheet.getRows(); // Get all rows from the "colab" sheet
        
        // Find the row with the matching phone number
        const matchingRow = rows.find(row => row._rawData[1] === phoneNumber);
        
        if (matchingRow) {
          // If a matching row is found, return the name and phoneNumber
          return {
            name: matchingRow._rawData[0], // Assuming 'nombre' is the column name for names
            phoneNumber: matchingRow._rawData[1] // Assuming 'celular' is the column name for phone numbers
          };
        }
        
        return null; // Return null if no matching row is found
      } catch (error) {
        console.error('Error searching for the phone number in Google Sheets:', error);
        throw new Error('Failed to search for the phone number in Google Sheets');
      }
    }

    
  //   async getAvailableSlotsForDate(fecha: string): Promise<number[]> {
  //     await this.doc.loadInfo(); // Carga la información del documento
  
  //     // Acceder a la hoja de Registros
  //     const sheet = this.doc.sheetsByTitle['reservas'];
  //     const registros:any = await sheet.getRows();
  
  //     // Definir las horas de operación (por ejemplo, de 9 a 22 horas)
  //     const horaApertura = 9;
  //     const horaCierre = 22;
  
  //     // Inicializar el arreglo de disponibilidad
  //     const disponibilidad = Array.from({ length: horaCierre - horaApertura }, (_, i) => ({
  //         hora: i + horaApertura,
  //         reservas: 0,
  //     }));
  
  //     // Filtrar reservas para la fecha especificada
  //     registros.filter(row => row._rawData[1] === fecha).forEach(reserva => {
  //       console.log(reserva);  
  //       const horaInicio = parseInt(reserva._rawData[5], 10);
  //       console.log(horaInicio);
  //         if (horaInicio >= horaApertura && horaInicio < horaCierre) {
  //             const slot = disponibilidad.find(d => d.hora === horaInicio);
  //             if (slot) slot.reservas++;
  //         }
  //     });
  
  //     // Filtrar horas con menos de 3 reservas
  //     const horasDisponibles = disponibilidad.filter(d => d.reservas < 3).map(d => d.hora);
  
  //     return horasDisponibles;
  // }

//   async getAvailableSlotsForDate(fecha: string): Promise<any> {
//     await this.doc.loadInfo(); // Carga la información del documento

//     const sheet = this.doc.sheetsByTitle['reservas'];
//     const registros:any = await sheet.getRows();

//     const horaApertura = 9;
//     const horaCierre = 22;

//     // Convertir la fecha de consulta a objeto Date
//     const [dia, mes, año] = fecha.split('/');
//     const fechaConsulta = new Date(`${año}-${mes}-${dia}T00:00:00-05:00`); // Asume zona horaria de Perú (UTC-5)

//     const ahora = new Date();
//     const fechaActual = new Date(ahora.toISOString().split('T')[0] + 'T00:00:00-05:00'); // Asume zona horaria de Perú (UTC-5)

//     // Verificar si la fecha de consulta ya pasó
//     if (fechaConsulta < fechaActual) {
//         return "La fecha solicitada ya pasó.";
//     }

//     // Inicializar el arreglo de disponibilidad
//     const disponibilidad = Array.from({ length: horaCierre - horaApertura }, (_, i) => ({
//         hora: i + horaApertura,
//         reservas: 0,
//     }));

//     registros.forEach(reserva => {
//         const fechaReserva = reserva._rawData[1].split('/').reverse().join('-');
//         const horaInicio = parseInt(reserva._rawData[5], 10);

//         // Procesar solo reservas para la fecha de consulta
//         if (fechaReserva === fechaConsulta.toISOString().split('T')[0]) {
//             // Incrementar las reservas para la hora específica si no ha pasado
//             if (!(fechaConsulta.toDateString() === fechaActual.toDateString() && horaInicio < ahora.getHours())) {
//                 const slot = disponibilidad.find(d => d.hora === horaInicio);
//                 if (slot && slot.reservas < 3) { // Asume un máximo de 3 reservas por hora
//                     slot.reservas++;
//                 }
//             }
//         }
//     });

//     // Filtrar y devolver horas con menos de 3 reservas para la fecha de consulta
//     const horasDisponibles = disponibilidad
//         .filter(d => d.reservas < 3)
//         .map(d => d.hora);

//     return horasDisponibles;
// }


// async getAvailableSlotsForDate(fecha: string): Promise<number[]> {
//   await this.doc.loadInfo(); // Carga la información del documento

//   const sheet = this.doc.sheetsByTitle['reservas'];
//   const registros:any = await sheet.getRows();

//   const horaApertura = 9;
//   const horaCierre = 22;

//   // Convertir la fecha de consulta a objeto Date
//   const [dia, mes, año] = fecha.split('/');
//   const fechaConsulta = new Date(Date.UTC(parseInt(año), parseInt(mes) - 1, parseInt(dia)));

//   // Obtener la fecha y hora actual ajustada a UTC para comparación
//   const ahoraUTC = new Date();
//   const ahora = new Date(Date.UTC(ahoraUTC.getUTCFullYear(), ahoraUTC.getUTCMonth(), ahoraUTC.getUTCDate()));

//   // Verificar si la fecha de consulta ya pasó
//   if (fechaConsulta < ahora) {
//       return []; // Retorna un array vacío si la fecha ya pasó
//   }

//   // Preparar un objeto para contar las reservas por hora
//   const reservasPorHora = {};
//   registros.forEach(registro => {
//       const [registroDia, registroMes, registroAño] = registro._rawData[1].split('/');
//       const fechaReserva = new Date(Date.UTC(parseInt(registroAño), parseInt(registroMes) - 1, parseInt(registroDia)));

//       // Ignorar registros que no corresponden a la fecha de consulta
//       if (fechaReserva.getTime() !== fechaConsulta.getTime()) return;

//       const horaInicio = parseInt(registro._rawData[1], 10);
//       if (!reservasPorHora[horaInicio]) reservasPorHora[horaInicio] = 0;
//       reservasPorHora[horaInicio]++;
//   });

//   // Determinar las horas disponibles
//   const horasDisponibles = [];
//   for (let hora = horaApertura; hora < horaCierre; hora++) {
//       const reservas = reservasPorHora[hora] || 0;
//       // Si la fecha de consulta es hoy, ignora las horas que ya pasaron
//       if (fechaConsulta.toDateString() === ahora.toDateString() && hora <= ahoraUTC.getHours()) continue;
//       // Si hay menos de 3 reservas para la hora, se considera disponible
//       if (reservas < 3) horasDisponibles.push(hora);
//   }

//   return horasDisponibles;
// }

// async getAvailableSlotsForDate(fecha: string): Promise<number[]> {
//   await this.doc.loadInfo(); // Carga la información del documento

//   const sheet = this.doc.sheetsByTitle['reservas'];
//   const registros:any = await sheet.getRows();

//   const horaApertura = 9;
//   const horaCierre = 22;

//   // Convertir la fecha de consulta a objeto Date
//   const [dia, mes, año] = fecha.split('/');
//   const fechaConsulta = new Date(Date.UTC(parseInt(año), parseInt(mes) - 1, parseInt(dia), 0, 0, 0));

//   // Obtener la fecha y hora actual en UTC para la comparación
//   const ahoraUTC = new Date();
//   const fechaActualUTC = new Date(Date.UTC(ahoraUTC.getUTCFullYear(), ahoraUTC.getUTCMonth(), ahoraUTC.getUTCDate()));

//   // Verificar si la fecha de consulta ya pasó
//   if (fechaConsulta < fechaActualUTC) {
//       return []; // Retorna un array vacío si la fecha ya pasó
//   }

//   const reservasPorHora = {};
//   registros.forEach(registro => {
//       const [registroDia, registroMes, registroAño] = registro._rawData[1].split('/');
//       const fechaReserva = new Date(Date.UTC(parseInt(registroAño), parseInt(registroMes) - 1, parseInt(registroDia), 0, 0, 0));

//       // Ignorar registros que no corresponden a la fecha de consulta
//       if (fechaReserva.getTime() === fechaConsulta.getTime()) {
//           const horaInicio = parseInt(registro._rawData[5], 10); // Asumiendo que la hora de inicio está en esta posición
//           if (!reservasPorHora[horaInicio]) {
//               reservasPorHora[horaInicio] = 1;
//           } else {
//               reservasPorHora[horaInicio] += 1;
//           }
//       }
//   });

//   const horasDisponibles = [];
//   for (let hora = horaApertura; hora < horaCierre; hora++) {
//       const reservas = reservasPorHora[hora] || 0;
//       if (reservas < 3) {
//           horasDisponibles.push(hora);
//       }
//   }

//   // Filtrar horas que ya pasaron si la fecha de consulta es hoy
//   const ahora = new Date();
//   if (fechaConsulta.toDateString() === ahora.toDateString()) {
//       const horaActual = ahora.getUTCHours(); // Considera ajustar esto si tu zona horaria no es UTC
//       return horasDisponibles.filter(hora => hora > horaActual);
//   }

//   return horasDisponibles;
// }

  

async getAvailableSlotsForDate(fecha: string): Promise<number[]> {
    await this.doc.loadInfo(); // Carga la información del documento

    const sheet = this.doc.sheetsByTitle['reservas'];
    const registros:any = await sheet.getRows();

    const horaApertura = 9;
    const horaCierre = 22;

    // Ajustar la fecha de consulta a la zona horaria de Perú (UTC-5)
    const fechaConsulta = moment.tz(fecha, "DD/MM/YYYY", "America/Lima");

    // Obtener la fecha y hora actual en la zona horaria de Perú
    const ahora = moment.tz("America/Lima");
    const horaActualPeru = ahora.hour();

    // Verificar si la fecha de consulta ya pasó
    if (fechaConsulta.isBefore(ahora, 'day')) {
        return []; // Retorna un array vacío si la fecha ya pasó
    }

    const reservasPorHora = {};
    registros.forEach(registro => {
        const fechaReserva = moment.tz(registro._rawData[1], "DD/MM/YYYY", "America/Lima");

        if (fechaReserva.isSame(fechaConsulta, 'day')) {
            const horaInicio = parseInt(registro._rawData[5], 10);
            reservasPorHora[horaInicio] = (reservasPorHora[horaInicio] || 0) + 1;
        }
    });

    // Filtrar horas disponibles considerando la hora actual para el día de consulta
    const horasDisponibles = [];
    for (let hora = horaApertura; hora < horaCierre; hora++) {
        const reservas = reservasPorHora[hora] || 0;
        // Si la fecha de consulta es hoy, y la hora ya pasó, no incluirla
        if (fechaConsulta.isSame(ahora, 'day') && hora <= horaActualPeru) continue;
        if (reservas < 3) horasDisponibles.push(hora);
    }

    return horasDisponibles;
}

    
    
}

