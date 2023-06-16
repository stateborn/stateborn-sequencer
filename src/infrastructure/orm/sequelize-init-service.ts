import { ProposalTypeOrm } from './model/proposal-type-orm';
import { ProposalType } from '../../domain/model/proposal/proposal-type';
import { SequencerOrm } from './model/sequencer-orm';
import { UserOrm } from './model/user-orm';
import { ProposalOrm } from './model/proposal-orm';
import { VoteOrm } from './model/vote-orm';
import { ProposalReportOrm } from './model/proposal-report-orm';
import { TokenOrm } from './model/dao/token-orm';
import { initializeDaoAssociations } from './model/dao/dao-token-orm';
import { Dao } from '../../domain/model/dao/dao';
import { DaoOrm } from './model/dao/dao-orm';
import { SEQUELIZE } from './sequelize-connection-service';

export const syncOrm = async () => {
    try {
        await DaoOrm.sync();
        await TokenOrm.sync();
        await initializeDaoAssociations();
        ProposalTypeOrm.sync()
            .then(() => {
                const constantData = Object.values(ProposalType).map((proposalType) => {
                    return {
                        'type': proposalType.toString(),
                    };
                });
                return ProposalTypeOrm.bulkCreate(constantData, {
                    ignoreDuplicates: true // Ignore rows with duplicate values
                });
            })
            .then(() => {
                console.log('ProposalTypeOrm synced successfully');
            })
            .catch((error) => {
                console.error('Error synchronizing ProposalTypeOrm:', error);
            });
        await SequencerOrm.sync();
        await UserOrm.sync();
        await ProposalOrm.sync();
        await VoteOrm.sync();
        await ProposalReportOrm.sync();
        await SEQUELIZE.query("CREATE INDEX if not exists proposal_title_full_text_index_2 ON proposals USING GIN (to_tsvector('simple', title))");
        await SEQUELIZE.query("CREATE INDEX if not exists proposal_ipfs_hash_full_text_index ON proposals USING GIN (to_tsvector('simple', ipfs_hash))");
        await SEQUELIZE.query("CREATE INDEX if not exists dao_name_full_text_index ON daos USING GIN (to_tsvector('simple', name))");
        await SEQUELIZE.query("CREATE INDEX if not exists dao_description_full_text_index ON daos USING GIN (to_tsvector('simple', description))");
        await SEQUELIZE.query("CREATE INDEX if not exists dao_ipfs_hash_full_text_index ON daos USING GIN (to_tsvector('simple', ipfs_hash))");
    } catch (error) {
        console.error('Unable to connect to DB:', error);
        throw error;
    }
};
