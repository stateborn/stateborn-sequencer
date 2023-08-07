import { ClientProposalTransaction } from '../client-proposal-transaction';
import { BlockchainProposalStatus } from '../blockchain-proposal-status';
import { AutoMap } from '@automapper/classes';
import { BlockchainProposalTransaction } from './blockchain-proposal-transaction';
import { BlockchainProposal } from './blockchain-proposal';

export class ProposalTransaction {
    @AutoMap()
    clientProposalTransaction: ClientProposalTransaction;
    @AutoMap()
    id: string;
    @AutoMap()
    proposalIpfsHash: string;
    @AutoMap()
    transactionStatus: BlockchainProposalStatus;
    @AutoMap()
    createdAt: string;
    @AutoMap()
    updatedAt: string;
    @AutoMap()
    blockchainProposal?: BlockchainProposal;
    constructor(clientProposalTransaction: ClientProposalTransaction, id: string, proposalIpfsHash: string, transactionStatus: BlockchainProposalStatus, createdAt: string, updatedAt: string, blockchainProposal?: BlockchainProposal) {
        this.clientProposalTransaction = clientProposalTransaction;
        this.id = id;
        this.proposalIpfsHash = proposalIpfsHash;
        this.transactionStatus = transactionStatus;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.blockchainProposal = blockchainProposal;
    }


}