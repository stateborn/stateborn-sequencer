export class User {
    private readonly address;

    constructor(address: string) {
        this.address = address;
    }

    public getAddress(): string {
        return this.address;
    }
}