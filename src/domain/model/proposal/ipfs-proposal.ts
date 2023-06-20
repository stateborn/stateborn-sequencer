import { AutoMap } from '@automapper/classes';
import { ClientProposal } from './client-proposal';

export class IpfsProposal {

    @AutoMap(() => ClientProposal)
    clientProposal: ClientProposal;

    @AutoMap()
    creatorSignature: string;

    constructor(clientProposal: ClientProposal, creatorSignature: string) {
        this.clientProposal = clientProposal;
        this.creatorSignature = creatorSignature;
    }
}