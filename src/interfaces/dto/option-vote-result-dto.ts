export class OptionVoteResultDto {
    option: string;
    votes: string;

    constructor(option: string, votes: string) {
        this.option = option;
        this.votes = votes;
    }
}