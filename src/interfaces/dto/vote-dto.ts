import { AutoMap } from '@automapper/classes';
import { ClientVote } from '../../domain/model/vote/client-vote';

export class VoteDto {

    @AutoMap(() => ClientVote)
    clientVote: ClientVote;
    @AutoMap()
    ipfsHash: string;
    @AutoMap()
    createdAt: Date;

    constructor(clientVote: ClientVote, ipfsHash: string, createdAt: Date) {
        this.clientVote = clientVote;
        this.ipfsHash = ipfsHash;
        this.createdAt = createdAt;
    }
}