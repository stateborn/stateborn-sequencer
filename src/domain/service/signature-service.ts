import { encodeBytes32String, ethers } from 'ethers';
import { OptionsClientProposalData } from '../model/proposal/options-client-proposal-data';
import { ProposalType } from '../model/proposal/proposal-type';
import { Vote } from '../model/vote/vote';
import { ClientProposal } from '../model/proposal/client-proposal';
import { ClientVote } from '../model/vote/client-vote';
import { ClientDao } from '../model/dao/client-dao';

export class SignatureService {

    public isProposalValid(clientProposal: ClientProposal, signature: string): boolean {
        const clientProposalToSign: string = ethers.keccak256(this.abiEncodeProposal(clientProposal));
        return this.verifySignatureAndGetAddress(clientProposalToSign, signature, clientProposal.creatorAddress);
    }

    private verifySignatureAndGetAddress(clientProposalToSign: string, signature: string, sequencerAddress: string) {
        const derivedAddress = ethers.verifyMessage(ethers.getBytes(clientProposalToSign), signature);
        return derivedAddress.toUpperCase() === sequencerAddress.toUpperCase();
    }

    public isVoteValid(clientVote: ClientVote, signature: string): boolean {
        const clientProposalToSign: string = ethers.keccak256(this.abiEncodeVote(clientVote));
        const derivedAddress = ethers.verifyMessage(ethers.getBytes(clientProposalToSign), signature);
        return derivedAddress.toUpperCase() === clientVote.voterAddress.toUpperCase();
    }

    private abiEncodeProposal(clientProposal: ClientProposal): string {
        const types = ["address", "bytes", "bytes", "bytes", "bytes32", "bytes32", "bytes32", 'uint256'];
        const values = [
            clientProposal.creatorAddress,
            ethers.toUtf8Bytes(clientProposal.daoIpfsHash),
            ethers.toUtf8Bytes(clientProposal.title),
            ethers.toUtf8Bytes(clientProposal.description),
            encodeBytes32String(clientProposal.proposalType),
            encodeBytes32String(clientProposal.startDateUtc),
            encodeBytes32String(clientProposal.endDateUtc),
            Number(clientProposal.blockNumber)];
        if (clientProposal.proposalType === ProposalType.OPTIONS) {
            types.push('bytes');
            const options = (<OptionsClientProposalData>clientProposal.data).options.join('');
            values.push(ethers.toUtf8Bytes(options));
        }
        // Same as `abi.encodePacked` in Solidity
        return ethers.solidityPacked(types, values);
    }

    public getEncodedVoteKeccak256(vote: Vote, proposalIpfsHash: string): string {
        return ethers.keccak256(this.abiEncodeVote(new ClientVote(
            vote.ipfsVote.clientVote.voterAddress,
            proposalIpfsHash,
            vote.ipfsVote.clientVote.vote,
            vote.ipfsVote.clientVote.votingPower,
        )));
    }

    private abiEncodeVote(clientVote: ClientVote): string {
        // Same as `abi.encodePacked` in Solidity
        return ethers.solidityPacked(
            ["address", "bytes", "bytes32", "uint32"],
            [
                clientVote.voterAddress,
                ethers.toUtf8Bytes(clientVote.proposalIpfsHash),
                encodeBytes32String(clientVote.vote),
                Number(clientVote.votingPower)
            ]
        );
    }

    public isDaoValid(clientDao: ClientDao, signature: string, expectedAddress: string): boolean {
        const clientProposalToSign: string = ethers.keccak256(this.abiEncodeDao(clientDao));
        return this.verifySignatureAndGetAddress(clientProposalToSign, signature, expectedAddress);
    }

    private abiEncodeDao(clientDao: ClientDao): string {
        const types = ["bytes", "bytes", "bytes", "uint32", "uint32", "bytes32", "address", "bytes32"];
        const values = [
            ethers.toUtf8Bytes(clientDao.name),
            ethers.toUtf8Bytes(clientDao.description),
            ethers.toUtf8Bytes(clientDao.imageBase64),
            Number(clientDao.proposalTokenRequiredQuantity),
            Number(clientDao.ownersMultisigThreshold),
            encodeBytes32String(clientDao.token.type),
            clientDao.token.address,
            encodeBytes32String(clientDao.token.network),
        ];
        for (const owner of clientDao.owners) {
            types.push('address');
            values.push(owner);
        }
        // Same as `abi.encodePacked` in Solidity
        return ethers.solidityPacked(types, values);
    }
}