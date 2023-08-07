import { BlockchainProposalTransactionType } from '../../../domain/model/proposal/blockchain-proposal-transaction-type';
import { AutoMap } from '@automapper/classes';
import { ProposalTransactionData } from '../../../domain/model/proposal/proposal-transaction/proposal-transaction-data';

export class BlockchainProposalTransactionDto {
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