import { ClientVote } from './client-vote';
import { AutoMap } from '@automapper/classes';

export class IpfsVote {

    @AutoMap(() => ClientVote)
    clientVote: ClientVote;

    @AutoMap()
    userSignature: string;

    constructor(clientVote: ClientVote, userSignature: string) {
        this.clientVote = clientVote;
        this.userSignature = userSignature;
    }
}