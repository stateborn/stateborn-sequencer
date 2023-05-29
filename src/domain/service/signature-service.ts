import { ClientProposalDto } from '../../interfaces/dto/client-proposal-dto';
import { encodeBytes32String, ethers } from 'ethers';
import { ClientVoteDto } from '../../interfaces/dto/client-vote-dto';

export class SignatureService {

    public isProposalValid(clientProposalDto: ClientProposalDto, signature: string): boolean {
        const clientProposalToSign: string = ethers.keccak256(this.abiEncodeProposal(clientProposalDto));
        const derivedAddress = ethers.verifyMessage(ethers.getBytes(clientProposalToSign), signature);
        return derivedAddress.toUpperCase() === clientProposalDto.getSequencerAddress().toUpperCase();
    }

    public isVoteValid(userVoteDto: ClientVoteDto, signature: string): boolean {
        const clientProposalToSign: string = ethers.keccak256(this.abiEncodeVote(userVoteDto));
        const derivedAddress = ethers.verifyMessage(ethers.getBytes(clientProposalToSign), signature);
        return derivedAddress.toUpperCase() === userVoteDto.getVoterAddress().toUpperCase();
    }

    private abiEncodeProposal(clientProposalDto: ClientProposalDto): string {
        // Same as `abi.encodePacked` in Solidity
        return ethers.solidityPacked(
            ["address", "bytes", "bytes", "address", "bytes32"],
            [clientProposalDto.getSequencerAddress(), ethers.toUtf8Bytes(clientProposalDto.getTitle()), ethers.toUtf8Bytes(clientProposalDto.getDescription()),
                clientProposalDto.getTokenAddress(), encodeBytes32String(clientProposalDto.getProposalType())]
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