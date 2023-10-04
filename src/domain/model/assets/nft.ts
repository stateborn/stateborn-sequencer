import { AutoMap } from '@automapper/classes';

export class Nft {

    @AutoMap()
    nftTokenId: string;
    @AutoMap()
    name?: string;
    @AutoMap()
    description?: string;
    @AutoMap()
    tokenUri?: string;
    @AutoMap()
    tokenMetadata?: any;
    @AutoMap()
    tokenMetadataSha256Hex?: string;
    @AutoMap()
    imageBase64?: string;
    @AutoMap()
    thumbnailImageBase64?: string;

    tokenId?: string;
    // database id
    id?: string;

    constructor(nftTokenId: string, name?: string, description?: string, tokenUri?: string, tokenMetadata?: any, tokenMetadataSha256Hex?: string,
                imageBase64?: string, thumbnailImageBase64?: string, tokenId?: string, id?: string) {
        this.nftTokenId = nftTokenId;
        this.name = name;
        this.description = description;
        this.tokenUri = tokenUri;
        this.tokenMetadata = tokenMetadata;
        this.tokenMetadataSha256Hex = tokenMetadataSha256Hex;
        this.imageBase64 = imageBase64;
        this.thumbnailImageBase64 = thumbnailImageBase64;
        this.tokenId = tokenId;
        this.id = id;
    }
}