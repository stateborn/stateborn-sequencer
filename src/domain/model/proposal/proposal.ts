import { IpfsProposal } from './ipfs-proposal';
import { AutoMap } from '@automapper/classes';
import { IProposalData } from './i-proposal-data';

export class Proposal {

    @AutoMap(() => IpfsProposal)
    private readonly ipfsProposal: IpfsProposal;

    @AutoMap()
    private readonly ipfsHash: string;

    @AutoMap()
    private readonly id: string;

    constructor(ipfsProposal: IpfsProposal, ipfsHash: string, id: string) {
        this.ipfsProposal = ipfsProposal;
        this.ipfsHash = ipfsHash;
        this.id = id;
    }

    public getIpfsProposal(): IpfsProposal {
        return this.ipfsProposal;
    }

    public getIpfsHash(): string {
        return this.ipfsHash;
    }

    public getId(): string {
        return this.id;
    }
}