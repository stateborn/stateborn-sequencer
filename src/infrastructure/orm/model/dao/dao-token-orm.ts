import { TokenOrm } from './token-orm';
import { SEQUELIZE } from '../../sequelize-connection-service';
import { DaoOrm } from './dao-orm';

export const initializeDaoAssociations = async () => {
    DaoOrm.belongsToMany(TokenOrm, {through: 'dao_tokens'});
    TokenOrm.belongsToMany(DaoOrm, {through: 'dao_tokens'});
    await SEQUELIZE.sync();
}