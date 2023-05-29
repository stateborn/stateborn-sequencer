import { AutoMap } from '@automapper/classes';
import { ClientProposalDto } from './client-proposal-dto';

export class ProposalDto {

    @AutoMap(() => ClientProposalDto)
    clientProposal: ClientProposalDto;

    @AutoMap()
    sequencerSignature: string;

    @AutoMap()
    ipfsHash: string;

    constructor(clientProposal: ClientProposalDto, sequencerSignature: string, ipfsHash: string) {
        this.clientProposal = clientProposal;
        this.sequencerSignature = sequencerSignature;
        this.ipfsHash = ipfsHash;
    }
}