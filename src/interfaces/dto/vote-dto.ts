import { ClientVoteDto } from './client-vote-dto';
import { AutoMap } from '@automapper/classes';

export class VoteDto {

    @AutoMap(() => ClientVoteDto)
    clientVote: ClientVoteDto;
    @AutoMap()
    ipfsHash: string;
    @AutoMap()
    createdAt: Date;

    constructor(clientVote: ClientVoteDto, ipfsHash: string, createdAt: Date) {
        this.clientVote = clientVote;
        this.ipfsHash = ipfsHash;
        this.createdAt = createdAt;
    }
}