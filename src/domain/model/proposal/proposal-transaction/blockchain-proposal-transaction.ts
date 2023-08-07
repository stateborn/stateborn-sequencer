import { BlockchainProposalTransactionType } from '../blockchain-proposal-transaction-type';
import { AutoMap } from '@automapper/classes';
import { ProposalTransactionData } from './proposal-transaction-data';

export class BlockchainProposalTransaction {
    @AutoMap()
    id: string;
    @AutoMap()
    transactionType: BlockchainProposalTransactionType;
    @AutoMap()
    data: ProposalTransactionData;

    constructor(id: string, transactionType: BlockchainProposalTransactionType, data: ProposalTransactionData) {
        this.id = id;
        this.transactionType = transactionType;
        this.data = data;
    }
}