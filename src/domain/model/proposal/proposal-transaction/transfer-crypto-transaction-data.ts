import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { ProposalTransactionData } from './proposal-transaction-data';

export class TransferCryptoTransactionData implements ProposalTransactionData{
    @AutoMap()
    @IsString()
    @IsNotEmpty()
    transferToAddress: string;

    // in wei, not in eth
    @AutoMap()
    @IsNumberString()
    // in wei, not in eth
    amount: string;

    constructor(transferToAddress: string, amount: string) {
        this.transferToAddress = transferToAddress;
        this.amount = amount;
    }
}