import { IpfsProposal } from './ipfs-proposal';
import { AutoMap } from '@automapper/classes';

export class Proposal {

    @AutoMap(() => IpfsProposal)
    readonly ipfsProposal: IpfsProposal;

    @AutoMap()
    readonly ipfsHash: string;

    constructor(ipfsProposal: IpfsProposal, ipfsHash: string) {
        this.ipfsProposal = ipfsProposal;
        this.ipfsHash = ipfsHash;
    }
}