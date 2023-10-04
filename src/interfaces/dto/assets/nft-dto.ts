import { AutoMap } from '@automapper/classes';

export class NftDto {
    @AutoMap()
    name?: string;

    @AutoMap()
    description?: string;

    @AutoMap()
    thumbnailImageBase64?: string;

    constructor(name: string, description: string, thumbnailImageBase64: string) {
        this.name = name;
        this.description = description;
        this.thumbnailImageBase64 = thumbnailImageBase64;
    }
}