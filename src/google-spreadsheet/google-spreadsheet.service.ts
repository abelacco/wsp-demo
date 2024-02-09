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
