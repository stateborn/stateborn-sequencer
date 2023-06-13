import { ClientProposal } from './client-proposal';
import { AutoMap } from '@automapper/classes';

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