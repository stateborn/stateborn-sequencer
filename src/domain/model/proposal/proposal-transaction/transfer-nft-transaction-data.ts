import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ProposalTransactionData } from './proposal-transaction-data';
import { Type } from 'class-transformer';
import { ClientToken } from '../../dao/client-token';

export class TransferNftTransactionData implements ProposalTransactionData{
    @AutoMap()
    @ValidateNested()
    @Type(() => ClientToken)
    token: ClientToken;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    transferToAddress: string;

    @AutoMap()
    @IsNotEmpty()
    tokenId: string;

    constructor(token: ClientToken, transferToAddress: string,  tokenId: string) {
        this.token = token;
        this.transferToAddress = transferToAddress;
        this.tokenId = tokenId;
    }
}