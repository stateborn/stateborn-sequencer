import {
    BlockchainProposalChainTransactionStatus
} from '../../../domain/model/proposal/blockchain-proposal-chain-transaction-status';
import { AutoMap } from '@automapper/classes';

export class BlockchainProposalChainTransactionDto {
    @AutoMap()
    txHash: string;

    @AutoMap()
    transactionStatus: BlockchainProposalChainTransactionStatus;

    constructor(txHash: string, transactionStatus: BlockchainProposalChainTransactionStatus) {
        this.txHash = txHash;
        this.transactionStatus = transactionStatus;
    }
}