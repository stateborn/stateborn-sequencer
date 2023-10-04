import { TokenOrm } from './token-orm';
import { SEQUELIZE } from '../../sequelize-connection-service';
import { DaoOrm } from './dao-orm';
import { DaoContractOrm } from './dao-contract-orm';
import { ProposalOrm } from '../proposal-orm';
import { NftOrm } from '../nft/nft-orm';

export const initializeDaoAssociations = async () => {
    DaoOrm.belongsToMany(TokenOrm, {through: 'dao_tokens'});
    DaoOrm.hasMany(ProposalOrm, {foreignKey: {name: 'dao_ipfs_hash', allowNull: false}});
    TokenOrm.belongsToMany(DaoOrm, {through: 'dao_tokens'});
    DaoContractOrm.belongsTo(DaoOrm, { foreignKey: {name: 'dao_ipfs_hash', allowNull: false }});
    DaoOrm.hasMany(DaoContractOrm, {foreignKey: 'dao_ipfs_hash'});
    TokenOrm.hasOne(NftOrm, {foreignKey: {name: 'token_id', allowNull: false}});
    await SEQUELIZE.sync();
}