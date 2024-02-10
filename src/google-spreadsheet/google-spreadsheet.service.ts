import { Injectable } from '@nestjs/common';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

@Injectable()
export class GoogleSpreadsheetService {
  private doc: GoogleSpreadsheet;
  private jwtClient: JWT;

  constructor() {
    const sheetId = '1BxQYbggRrltM96Au0VoON2gZQz2Ox6okk3LdkOaI24I';
    if (!sheetId) {
      throw new Error('Sheet ID is required');
    }
    this.jwtClient = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });

    this.doc = new GoogleSpreadsheet(sheetId, this.jwtClient); // Pass the auth argument
    console.log('GoogleSpreadsheetService initialized', this.doc);
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
    
    // async getAvailableDay(): Promise<string> {
    //   try {
    //     await this.doc.loadInfo(); // Load the spreadsheet information
    //     const sheet = this.doc.sheetsByIndex[0]; // Access the sheet by index
    //     const rows: any = await sheet.getRows();
    
    //     const shiftsByDate = {};
    //     rows.forEach(row => {
    //       // Asumiendo que row._rawData[1] contiene la fecha en formato DD/MM/YYYY
    //       const fecha = row._rawData[1];
    //       if (shiftsByDate[fecha]) {
    //         shiftsByDate[fecha].push(row);
    //       } else {
    //         shiftsByDate[fecha] = [row];
    //       }
    //     });
    
    //     // Convertir las fechas a objetos Date para ordenarlas y luego volver a convertirlas a DD/MM/YYYY
    //     const sortedDates = Object.keys(shiftsByDate).sort((a, b) => {
    //       const [dayA, monthA, yearA] = a.split("/").map(Number);
    //       const [dayB, monthB, yearB] = b.split("/").map(Number);
    //       return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
    //     });
    
    //     // Buscar el primer día con menos de 4 turnos registrados
    //     let nextAvailableDate = sortedDates.find(date => shiftsByDate[date].length < 4);
    
    //     // Si no se encuentra tal día, se calcula el día siguiente al último registrado
    //     if (!nextAvailableDate) {
    //       const [lastDay, lastMonth, lastYear] = sortedDates[sortedDates.length - 1].split("/").map(Number);
    //       let nextDay = new Date(lastYear, lastMonth - 1, lastDay);
    //       nextDay.setDate(nextDay.getDate() + 1); // Incrementa el día
          
    //       // Formatea el objeto Date a DD/MM/YYYY para la fecha del próximo día
    //       nextAvailableDate = nextDay.toLocaleDateString('es-PE', {
    //         timeZone: 'America/Lima',
    //         day: '2-digit',
    //         month: '2-digit',
    //         year: 'numeric',
    //       });
    //     }
    
    //     return nextAvailableDate; // Este ya está en formato DD/MM/YYYY
    //   } catch (error) {
    //     console.error('Error retrieving the next available day:', error);
    //     throw new Error('Failed to retrieve the next available day');
    //   }
    // }
    
}

  // async retrieveDayMenu(dayNumber = 0): Promise<any[]> {
  //   try {
  //     await this.doc.loadInfo();
  //     const sheet = this.doc.sheetsByIndex[0]; // assuming the first sheet is the one we want
  //     await sheet.loadCells('A1:H10');

  //     const list = [];
  //     const rows = await sheet.getRows();
  //     for (let i = 0; i < rows.length; i++) {
  //       const cell = sheet.getCell(i + 1, dayNumber - 1);
  //       list.push(cell.value);
  //     }

  //     return list;
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error('Failed to retrieve day menu');
  //   }
  // }

  // async saveOrder(data: { fecha: string; telefono: string; nombre: string; pedido: string; observaciones: string; }): Promise<any> {
  //   try {
  //     await this.doc.loadInfo();
  //     const sheet = this.doc.sheetsByIndex[1]; // assuming the second sheet is for orders

  //     const order = await sheet.addRow(data);
  //     return order;
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error('Failed to save order');
  //   }
  // }
