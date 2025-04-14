import { IBaseLabel, IBaseName, IFaculty, ISemester } from '../dashboard/type';

export interface IDecree {
  id: number;
  number: string;
  name: string;
  department: IFaculty;
  decreeType: IBaseName;
  file: string;
  date: number;
}

export interface IReference {
  id: number;
  reference_number: string;
  department: IFaculty;
  semester: ISemester;
  level: IBaseName;
  file: string;
  reference_date: number;
}

export interface IDocument {
  type: string;
  id: number;
  name: string;
  attributes: IBaseLabel[];
  file: string;
}
