import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsNumberString, IsString, ValidateNested } from 'class-validator';
import { ProposalTransactionData } from './proposal-transaction-data';
import { ClientToken } from '../../dao/client-token';
import { Type } from 'class-transformer';

export class TransferErc20TransactionData implements ProposalTransactionData {

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
    @IsNumberString()
    transferAmount: string;

    constructor(token: ClientToken, transferToAddress: string, transferAmount: string) {
        this.token = token;
        this.transferToAddress = transferToAddress;
        this.transferAmount = transferAmount;
    }
}