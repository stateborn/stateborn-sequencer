export class DaoHeader {
    ipfsHash: string;
    proposalNumber: number;

    constructor(ipfsHash: string, proposalNumber: number) {
        this.ipfsHash = ipfsHash;
        this.proposalNumber = proposalNumber;
    }
}