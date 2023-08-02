import { AutoMap } from '@automapper/classes';
import { IsDefined, IsEnum, IsNotEmpty, IsNumberString, IsObject, IsString } from 'class-validator';
import { ProposalTransactionType } from './proposal-transaction-type';
import { ProposalTransactionData } from './proposal-transaction/proposal-transaction-data';

export class ClientProposalTransaction {

    @AutoMap()
    @IsEnum(ProposalTransactionType)
    @IsDefined()
    transactionType: ProposalTransactionType;

    @AutoMap()
    @IsObject()
    @IsDefined()
    data: ProposalTransactionData;

    constructor(transactionType: ProposalTransactionType, data: ProposalTransactionData) {
        this.transactionType = transactionType;
        this.data = data;
    }
}