import { BlockchainProposalStatus } from '../blockchain-proposal-status';
import { AutoMap } from '@automapper/classes';
import { BlockchainProposalTransaction } from './blockchain-proposal-transaction';
import { BlockchainProposalChainTransaction } from './blockchain-proposal-chain-transaction';

export class BlockchainProposal {
    @AutoMap()
    proposalIpfsHash: string;
    @AutoMap()
    chainId: string;
    @AutoMap()
    status: BlockchainProposalStatus;
    @AutoMap(() => BlockchainProposalTransaction)
    blockchainProposalTransactions: BlockchainProposalTransaction[];
    @AutoMap(() => BlockchainProposalChainTransaction)
    blockchainProposalChainTransactions: BlockchainProposalChainTransaction[];
    @AutoMap()
    address?: string;
    constructor(proposalIpfsHash: string, chainId: string, status: BlockchainProposalStatus, blockchainProposalTransactions: BlockchainProposalTransaction[], blockchainProposalChainTransactions: BlockchainProposalChainTransaction[], address?: string) {
        this.proposalIpfsHash = proposalIpfsHash;
        this.chainId = chainId;
        this.status = status;
        this.blockchainProposalTransactions = blockchainProposalTransactions;
        this.blockchainProposalChainTransactions = blockchainProposalChainTransactions;
        this.address = address;
    }
}