import { Sequencer } from '../model/sequencer';

export interface IDbSequencerRepository {
    findOrCreateSequencer(address: string): Promise<Sequencer>;
}