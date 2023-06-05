import { ClientProposalDto } from '../../interfaces/dto/client-proposal-dto';
import { encodeBytes32String, ethers } from 'ethers';
import { ClientVoteDto } from '../../interfaces/dto/client-vote-dto';
import { OptionsClientProposalDto } from '../../interfaces/dto/options-client-proposal-dto';
import { OptionsClientProposalData } from '../model/proposal/options-client-proposal-data';
import { ProposalType } from '../model/proposal/proposal-type';

export class SignatureService {

    public isProposalValid(clientProposalDto: ClientProposalDto, signature: string): boolean {
        const clientProposalToSign: string = ethers.keccak256(this.abiEncodeProposal(clientProposalDto));
        return this.verifySignatureAndGetAddress(clientProposalToSign, signature, clientProposalDto.getSequencerAddress());
    }

    private verifySignatureAndGetAddress(clientProposalToSign: string, signature: string, sequencerAddress: string) {
        const derivedAddress = ethers.verifyMessage(ethers.getBytes(clientProposalToSign), signature);
        return derivedAddress.toUpperCase() === sequencerAddress.toUpperCase();
    }

    public isVoteValid(userVoteDto: ClientVoteDto, signature: string): boolean {
        const clientProposalToSign: string = ethers.keccak256(this.abiEncodeVote(userVoteDto));
        const derivedAddress = ethers.verifyMessage(ethers.getBytes(clientProposalToSign), signature);
        return derivedAddress.toUpperCase() === userVoteDto.getVoterAddress().toUpperCase();
    }

    private abiEncodeProposal(clientProposalDto: ClientProposalDto): string {
        const types = ["address", "bytes", "bytes", "address", "bytes32", "bytes32", "bytes32"];
        const values = [clientProposalDto.getSequencerAddress(), ethers.toUtf8Bytes(clientProposalDto.getTitle()), ethers.toUtf8Bytes(clientProposalDto.getDescription()),
            clientProposalDto.getTokenAddress(), encodeBytes32String(clientProposalDto.getProposalType()),
            encodeBytes32String(clientProposalDto.getStartDateUtc()), encodeBytes32String(clientProposalDto.getEndDateUtc())];
        if (clientProposalDto.proposalType === ProposalType.OPTIONS) {
            types.push('bytes');
            const options = (<OptionsClientProposalData>clientProposalDto.data).options.join('');
            values.push(ethers.toUtf8Bytes(options));
        }
        // Same as `abi.encodePacked` in Solidity
        return ethers.solidityPacked(types, values);
    }

    private abiEncodeOptionsProposal(clientOptionsProposalDto: OptionsClientProposalDto): string {
        // Same as `abi.encodePacked` in Solidity
        const clientProposalOptions = clientOptionsProposalDto.getOptions().join('');
        return ethers.solidityPacked(
            ["address", "bytes", "bytes", "address", "bytes32", "bytes32", "bytes32", "bytes"],
            [clientOptionsProposalDto.getSequencerAddress(), ethers.toUtf8Bytes(clientOptionsProposalDto.getTitle()), ethers.toUtf8Bytes(clientOptionsProposalDto.getDescription()),
                clientOptionsProposalDto.getTokenAddress(), encodeBytes32String(clientOptionsProposalDto.getProposalType()),
                encodeBytes32String(clientOptionsProposalDto.getStartDateUtc()), encodeBytes32String(clientOptionsProposalDto.getEndDateUtc()),
                ethers.toUtf8Bytes(clientProposalOptions)]
        );
    }


    private abiEncodeVote(userVoteDto: ClientVoteDto): string {
        // Same as `abi.encodePacked` in Solidity
        return ethers.solidityPacked(
            ["address", "bytes", "bytes32", "uint32"],
            [
                userVoteDto.getVoterAddress(),
                ethers.toUtf8Bytes(userVoteDto.getProposalIpfsHash()),
                encodeBytes32String(userVoteDto.getVote()),
                Number(userVoteDto.getVotingPower())
            ]
        );
    }


}