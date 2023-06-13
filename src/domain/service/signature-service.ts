import { ClientProposalDto } from '../../interfaces/dto/client-proposal-dto';
import { encodeBytes32String, ethers } from 'ethers';
import { ClientVoteDto } from '../../interfaces/dto/client-vote-dto';
import { OptionsClientProposalData } from '../model/proposal/options-client-proposal-data';
import { ProposalType } from '../model/proposal/proposal-type';
import { Vote } from '../model/vote/vote';
import { CreateDaoDto } from '../../interfaces/dto/dao/create-dao-dto';
import { ClientDaoDto } from '../../interfaces/dto/dao/client-dao-dto';

export class SignatureService {

    public isProposalValid(clientProposalDto: ClientProposalDto, signature: string): boolean {
        const clientProposalToSign: string = ethers.keccak256(this.abiEncodeProposal(clientProposalDto));
        return this.verifySignatureAndGetAddress(clientProposalToSign, signature, clientProposalDto.creatorAddress);
    }

    private verifySignatureAndGetAddress(clientProposalToSign: string, signature: string, sequencerAddress: string) {
        const derivedAddress = ethers.verifyMessage(ethers.getBytes(clientProposalToSign), signature);
        return derivedAddress.toUpperCase() === sequencerAddress.toUpperCase();
    }

    public isVoteValid(clientVoteDto: ClientVoteDto, signature: string): boolean {
        const clientProposalToSign: string = ethers.keccak256(this.abiEncodeVote(clientVoteDto));
        const derivedAddress = ethers.verifyMessage(ethers.getBytes(clientProposalToSign), signature);
        return derivedAddress.toUpperCase() === clientVoteDto.getVoterAddress().toUpperCase();
    }

    private abiEncodeProposal(clientProposalDto: ClientProposalDto): string {
        const types = ["address", "bytes", "bytes", "bytes", "bytes32", "bytes32", "bytes32"];
        const values = [
            clientProposalDto.creatorAddress,
            ethers.toUtf8Bytes(clientProposalDto.daoIpfsHash),
            ethers.toUtf8Bytes(clientProposalDto.title),
            ethers.toUtf8Bytes(clientProposalDto.description),
            encodeBytes32String(clientProposalDto.proposalType),
            encodeBytes32String(clientProposalDto.startDateUtc),
            encodeBytes32String(clientProposalDto.endDateUtc)];
        if (clientProposalDto.proposalType === ProposalType.OPTIONS) {
            types.push('bytes');
            const options = (<OptionsClientProposalData>clientProposalDto.data).options.join('');
            values.push(ethers.toUtf8Bytes(options));
        }
        // Same as `abi.encodePacked` in Solidity
        return ethers.solidityPacked(types, values);
    }

    public getEncodedVoteKeccak256(vote: Vote, proposalIpfsHash: string): string {
        return ethers.keccak256(this.abiEncodeVote(new ClientVoteDto(
            vote.getIpfsVote().getClientVote().getVoterAddress(),
            proposalIpfsHash,
            vote.getIpfsVote().getClientVote().getVote(),
            vote.getIpfsVote().getClientVote().getVotingPower(),
        )));
    }

    private abiEncodeVote(clientVoteDto: ClientVoteDto): string {
        // Same as `abi.encodePacked` in Solidity
        return ethers.solidityPacked(
            ["address", "bytes", "bytes32", "uint32"],
            [
                clientVoteDto.getVoterAddress(),
                ethers.toUtf8Bytes(clientVoteDto.getProposalIpfsHash()),
                encodeBytes32String(clientVoteDto.getVote()),
                Number(clientVoteDto.getVotingPower())
            ]
        );
    }

    public isDaoValid(clientDaoDto: ClientDaoDto, signature: string, expectedAddress: string): boolean {
        const clientProposalToSign: string = ethers.keccak256(this.abiEncodeDao(clientDaoDto));
        return this.verifySignatureAndGetAddress(clientProposalToSign, signature, expectedAddress);
    }

    private abiEncodeDao(clientDaoDto: ClientDaoDto): string {
        const types = ["bytes", "bytes", "bytes", "uint32", "uint32", "bytes32", "address", "bytes32"];
        const values = [
            ethers.toUtf8Bytes(clientDaoDto.name),
            ethers.toUtf8Bytes(clientDaoDto.description),
            ethers.toUtf8Bytes(clientDaoDto.imageBase64),
            Number(clientDaoDto.proposalTokenRequiredQuantity),
            Number(clientDaoDto.ownersMultisigThreshold),
            encodeBytes32String(clientDaoDto.token.type),
            clientDaoDto.token.address,
            encodeBytes32String(clientDaoDto.token.network),
        ];
        for (const owner of clientDaoDto.owners) {
            types.push('address');
            values.push(owner);
        }
        // Same as `abi.encodePacked` in Solidity
        return ethers.solidityPacked(types, values);
    }



}