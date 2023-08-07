import { BlockchainProposalChainTransactionStatus } from '../blockchain-proposal-chain-transaction-status';
import { AutoMap } from '@automapper/classes';

export class BlockchainProposalChainTransaction {
    @AutoMap()
    txHash: string;
    @AutoMap()
    transactionStatus: BlockchainProposalChainTransactionStatus;

    constructor(txHash: string, transactionStatus: BlockchainProposalChainTransactionStatus) {
        this.txHash = txHash;
        this.transactionStatus = transactionStatus;
    }
}