import { ethers, InterfaceAbi, parseUnits } from 'ethers';
import { NetworkProviderService } from '../../infrastructure/network-provider-service';
import { ClientDao } from '../../domain/model/dao/client-dao';
import { ProposalReport } from '../../domain/model/proposal/report/proposal-report';
import { Proposal } from '../../domain/model/proposal/proposal';
import {
    TransferErc20TransactionData
} from '../../domain/model/proposal/proposal-transaction/transfer-erc-20-transaction-data';
import { BlockchainProposalTransactionType } from '../../domain/model/proposal/blockchain-proposal-transaction-type';
import {
    TransferNftTransactionData
} from '../../domain/model/proposal/proposal-transaction/transfer-nft-transaction-data';
import {
    ProposalWithReportAndBlockchainProposal
} from '../../domain/model/proposal/proposal-with-report-and-blockchain-proposal';

export class DaoTransactionService {

    private readonly DAO_ABI: InterfaceAbi = [
        // Some details about the token
        'function createProposal(bytes memory _proposalId,bytes32 _proposalMerkleRoot,address[] calldata _targets,uint256[] calldata _values,bytes[] calldata _payloads) payable public',
        'function sendErc20(bytes memory proposalId, address tokenAddress, address to, uint256 amount) external',
        'function sendNft(bytes memory proposalId, address tokenAddress, address to, uint256 tokenId) external',
        'function proposals(bytes) public view returns (address)',
        'event ProposalCreated(bytes proposalId, address proposalAddress)',
    ];

    private readonly PROPOSAL_ABI: InterfaceAbi = [
        'function getChallengeSequencerEndTime() public view returns (uint256)',
        'function getChallengeUserEndTime() public view returns (uint256)',
        'function executeBatch() public payable',
    ];


    private networkProviderService: NetworkProviderService;

    constructor({networkProviderService}: { networkProviderService: NetworkProviderService }) {
        this.networkProviderService = networkProviderService;
    }

    // returns [proposalAddress, txHash]
    public async createProposal(proposal: Proposal, dao: ClientDao, proposalReport: ProposalReport): Promise<string[]> {
        try {
            const contract = new ethers.Contract(dao.contractAddress!, this.DAO_ABI,
                this.networkProviderService.getNetworkProvider(dao.token.chainId).getSigner());
            const data = proposal.ipfsProposal.clientProposal.transactions!.map((transaction) => {
                let data;
                if (transaction.transactionType === BlockchainProposalTransactionType.TRANSFER_ERC_20_TOKENS) {
                    data = contract.interface.encodeFunctionData('sendErc20(bytes,address,address,uint256)', [
                        ethers.toUtf8Bytes(proposal.ipfsHash),
                        (<TransferErc20TransactionData>transaction.data).token.address,
                        (<TransferErc20TransactionData>transaction.data).transferToAddress,
                        ethers.parseUnits((<TransferErc20TransactionData>transaction.data).transferAmount, Number((<TransferErc20TransactionData>transaction.data).token.decimals)),
                    ]);
                } else if (transaction.transactionType === BlockchainProposalTransactionType.TRANSFER_NFT_TOKEN) {
                    data = contract.interface.encodeFunctionData('sendNft(bytes,address,address,uint256)', [
                        ethers.toUtf8Bytes(proposal.ipfsHash),
                        (<TransferNftTransactionData>transaction.data).token.address,
                        (<TransferNftTransactionData>transaction.data).transferToAddress,
                        Number((<TransferNftTransactionData>transaction.data).tokenId),
                    ]);
                } else {
                    throw new Error(`Unsupported transaction type: ${transaction.transactionType}`);
                }
                return data;
            });
            let txId = '';
            const promise: Promise<string[]> = new Promise((resolve, reject) => {
                contract.on("ProposalCreated", (proposalId: string, proposalAddress: string) => {
                    console.log(`Proposal ${proposalId} created: `, proposalAddress);
                    resolve([proposalAddress, txId]);
                });
            });
            const res = await contract.createProposal(
                ethers.toUtf8Bytes(proposal.ipfsHash),
                proposalReport.ipfsProposalReport.merkleRootHex,
                [dao.contractAddress!],
                [],
                data,
                {value: parseUnits("1", "ether")}
            );
            txId = res.hash;
            return promise;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public async executeProposalTransactions(proposal: ProposalWithReportAndBlockchainProposal): Promise<string> {
        try {
            const contract = new ethers.Contract(proposal.blockchainProposal?.address!,
                this.PROPOSAL_ABI,
                this.networkProviderService.getNetworkProvider(proposal.blockchainProposal?.chainId!).getSigner());
            const res = await  contract.executeBatch();
            return 'asdf';
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

}