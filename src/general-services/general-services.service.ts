import { Injectable } from '@nestjs/common';
import { CreateGeneralServiceDto } from './dto/create-general-service.dto';
import { UpdateGeneralServiceDto } from './dto/update-general-service.dto';
import { DocumentDto } from './dto/get-document.dto';
import { DOCUMENT_IDENTIFIERS } from 'src/common/constants';
import axios from 'axios';

@Injectable()
export class GeneralServicesService {

  private apiKey: string;
  private urlApiPeruService: string;

  constructor() {
    this.apiKey = process.env.API_PERU_KEY;
    this.urlApiPeruService = process.env.URL_API_PERU_SERVICE;
  }

  async findDocument(document:string) {
    const tipo = document.length === DOCUMENT_IDENTIFIERS.DNI_LENGTH ? DOCUMENT_IDENTIFIERS.DNI_TYPE : DOCUMENT_IDENTIFIERS.RUC_TYPE;
    const url = `${this.urlApiPeruService}${tipo}/${document}?token=${this.apiKey}`;
    const response = await axios.get(url);
    return response.data

  }
  
  create(createGeneralServiceDto: CreateGeneralServiceDto) {
    return 'This action adds a new generalService';
  }

  findAll() {
    return `This action returns all generalServices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} generalService`;
  }

  update(id: number, updateGeneralServiceDto: UpdateGeneralServiceDto) {
    return `This action updates a #${id} generalService`;
  }

  remove(id: number) {
    return `This action removes a #${id} generalService`;
  }
}
