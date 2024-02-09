import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GoogleSpreadsheetService } from './google-spreadsheet.service';

@Controller('google-spreadsheet')
export class GoogleSpreadsheetController {
  constructor(private readonly googleSpreadsheetService: GoogleSpreadsheetService) {}

  @Post('insert')
  insertData(@Body() data: any) {
    return this.googleSpreadsheetService.insertData(data.sheetIndex, data.rowData);
  }
}
  