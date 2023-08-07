import { AutoMap } from '@automapper/classes';
import { BlockchainProposalStatus } from '../../../domain/model/proposal/blockchain-proposal-status';
import { BlockchainProposalTransactionDto } from './blockchain-proposal-transaction-dto';
import { BlockchainProposalChainTransactionDto } from './blockchain-proposal-chain-transaction-dto';

export class BlockchainProposalDto {
    @AutoMap()
    proposalIpfsHash: string;
    @AutoMap()
    chainId: string;
    @AutoMap()
    status: BlockchainProposalStatus;
    @AutoMap(() => BlockchainProposalTransactionDto)
    blockchainProposalTransactions: BlockchainProposalTransactionDto[];
    @AutoMap(() => BlockchainProposalChainTransactionDto)
    blockchainProposalChainTransactions: BlockchainProposalChainTransactionDto[];
    @AutoMap()
    address?: string;

    constructor(proposalIpfsHash: string, chainId: string, status: BlockchainProposalStatus, blockchainProposalTransactions: BlockchainProposalTransactionDto[], blockchainProposalChainTransactions: BlockchainProposalChainTransactionDto[], address?: string) {
        this.proposalIpfsHash = proposalIpfsHash;
        this.chainId = chainId;
        this.status = status;
        this.blockchainProposalTransactions = blockchainProposalTransactions;
        this.blockchainProposalChainTransactions = blockchainProposalChainTransactions;
        this.address = address;
    }
}