import { Inter } from './inter';
import { A } from '../a';
import { B } from '../b';

export class Ser implements Inter {
    process(obiekt: B): any {
        return obiekt;
    }
}
const ser = new Ser();
ser.process(new B())