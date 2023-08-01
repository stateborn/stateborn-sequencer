import { MerkleTree } from 'merkletreejs';
import { keccak256 } from 'ethers';

/** This is stateful service */
export class MerkleTreeService {

    private merkleTree: MerkleTree | undefined = undefined;

    public initializeMerkleTree = (leafs: string[]) => {
        this.merkleTree = new MerkleTree(leafs, keccak256, {
            hashLeaves: true,
            sortPairs: true,
        });
    }

    public getHexRoot(): string {
        if (this.merkleTree === undefined) {
            throw new Error('Merkle tree is not initialized');
        }
        return this.merkleTree.getHexRoot();
    }
}