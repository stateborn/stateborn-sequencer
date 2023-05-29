import { ClientProposal } from './client-proposal';
import { AutoMap } from '@automapper/classes';

export class IpfsProposal {

    @AutoMap(() => ClientProposal)
    private readonly clientProposal: ClientProposal;

    @AutoMap()
    private readonly sequencerSignature: string;

    constructor(clientProposal: ClientProposal, sequencerSignature: string) {
        this.clientProposal = clientProposal;
        this.sequencerSignature = sequencerSignature;
    }

    public getClientProposal() {
        return this.clientProposal;
    }

    public getSequencerSignature() {
        return this.sequencerSignature;
    }
}