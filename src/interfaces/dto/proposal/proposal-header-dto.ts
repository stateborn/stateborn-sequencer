export class ProposalHeaderDto {

    ipfsHash: string;
    proposalsNumber: string;

    constructor(ipfsHash: string, proposalsNumber: string) {
        this.ipfsHash = ipfsHash;
        this.proposalsNumber = proposalsNumber;
    }
}