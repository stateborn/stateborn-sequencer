import { AutoMap } from '@automapper/classes';
import { ClientProposalDto } from './client-proposal-dto';

export class ProposalDto {

    @AutoMap(() => ClientProposalDto)
    clientProposal: ClientProposalDto;

    @AutoMap()
    creatorSignature: string;

    @AutoMap()
    ipfsHash: string;

    constructor(clientProposal: ClientProposalDto, creatorSignature: string, ipfsHash: string) {
        this.clientProposal = clientProposal;
        this.creatorSignature = creatorSignature;
        this.ipfsHash = ipfsHash;
    }
}