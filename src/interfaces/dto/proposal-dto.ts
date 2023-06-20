import { AutoMap } from '@automapper/classes';
import { ClientProposal } from '../../domain/model/proposal/client-proposal';

export class ProposalDto {

    @AutoMap(() => ClientProposal)
    clientProposal: ClientProposal;

    @AutoMap()
    creatorSignature: string;

    @AutoMap()
    ipfsHash: string;

    constructor(clientProposal: ClientProposal, creatorSignature: string, ipfsHash: string) {
        this.clientProposal = clientProposal;
        this.creatorSignature = creatorSignature;
        this.ipfsHash = ipfsHash;
    }
}