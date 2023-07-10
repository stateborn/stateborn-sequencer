export class WrongVotingPowerError extends Error {
    public readVotingPower: string;
    public proposalBlock: string;
    constructor(readVotingPower: string, proposalBlock: string) {
        super();
        this.readVotingPower = readVotingPower;
        this.proposalBlock = proposalBlock;
        Object.setPrototypeOf(this, WrongVotingPowerError.prototype);
    }
}
