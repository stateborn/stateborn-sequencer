import { AutoMap } from '@automapper/classes';
import { IsDefined, IsEnum, IsNotEmpty, IsNumberString, IsObject, IsString } from 'class-validator';
import { BlockchainProposalTransactionType } from './blockchain-proposal-transaction-type';
import { ProposalTransactionData } from './proposal-transaction/proposal-transaction-data';

export class ClientProposalTransaction {

    @AutoMap()
    @IsEnum(BlockchainProposalTransactionType)
    @IsDefined()
    transactionType: BlockchainProposalTransactionType;

    @AutoMap()
    @IsObject()
    @IsDefined()
    data: ProposalTransactionData;

    constructor(transactionType: BlockchainProposalTransactionType, data: ProposalTransactionData) {
        this.transactionType = transactionType;
        this.data = data;
    }
}