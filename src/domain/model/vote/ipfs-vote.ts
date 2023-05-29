import { ClientVote } from './client-vote';
import { AutoMap } from '@automapper/classes';

export class IpfsVote {

    @AutoMap(() => ClientVote)
    private readonly clientVote: ClientVote;

    @AutoMap(() => ClientVote)
    private readonly userSignature: string;

    constructor(clientVote: ClientVote, userSignature: string) {
        this.clientVote = clientVote;
        this.userSignature = userSignature;
    }

    public getClientVote(): ClientVote {
        return this.clientVote;
    }

    public getUserSignature(): string {
        return this.userSignature;
    }
}