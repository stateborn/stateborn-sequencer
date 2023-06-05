import { IProposalData } from './i-proposal-data';

export class OptionsClientProposalData implements IProposalData {
    options: string[];

    constructor(options: string[]) {
        this.options = options;
    }
}