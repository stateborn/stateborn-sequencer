import { Body, Get, JsonController, Param, Post, QueryParam, Req, Res } from 'routing-controllers';
import { DI_CONTAINER } from '../infrastructure/di/awilix-config-service';
import { Response } from 'express-serve-static-core';
import { CreateDaoDto } from './dto/dao/create-dao-dto';
import { CreateDaoService } from '../application/dao/create-dao-service';
import { IMapperService } from '../domain/service/i-mapper-service';
import { IDbDaoRepository } from '../domain/repository/i-db-dao-repository';
import { IDbProposalRepository } from '../domain/repository/i-db-proposal-repository';
import { ProposalHeaderDto } from './dto/proposal/proposal-header-dto';
import { LOGGER } from '../infrastructure/pino-logger-service';
import { NetworkAssetsService } from '../infrastructure/network-assets-service';
import { NetworkProviderService } from '../infrastructure/network-provider-service';
import { DaoAssetsDto } from './dto/assets/dao-assets-dto';
import { ethers } from 'ethers';
import { getBooleanProperty, getProperty } from '../application/env-var/env-var-service';

@JsonController('/api/rest/v1/dao')
export class DaoController {

    @Post('/')
    async createDao(
        @Res() res: Response,
        @Req() req: Request,
        @Body({ required: true, options: { limit: '5MB' } }) createDaoDto: CreateDaoDto) {
        const createDaoService = <CreateDaoService>DI_CONTAINER.resolve('createDaoService');
        await createDaoService.createDao(createDaoDto);
        return res.sendStatus(200);
    }

    @Get('/')
    async getDaosHeaders(
        @Res() res: Response,
        @Req() req: Request,
        @QueryParam('offset') offset: number,
        @QueryParam('limit') limit: number,
        @QueryParam('filter') filter?: string) {
        const dpProposalRepository = <IDbDaoRepository>DI_CONTAINER.resolve('dbDaoRepository');
        const daos = await dpProposalRepository.findDaosIpfsHashes(offset, limit, filter);
        return daos.map((_) => new ProposalHeaderDto(_.ipfsHash, _.proposalNumber.toString()));
    }

    @Get('/:daoIpfsHash')
    async getDao(
        @Res() res: Response,
        @Req() req: Request,
        @Param('daoIpfsHash') daoIpfsHash: string) {
        const dpProposalRepository = <IDbDaoRepository>DI_CONTAINER.resolve('dbDaoRepository');
        const mapperService = <IMapperService>DI_CONTAINER.resolve('mapperService');
        const dao = await dpProposalRepository.findDao(daoIpfsHash);
        return mapperService.toDaoDto(dao!);
    }


    @Get('/:daoIpfsHash/proposals/count')
    async getDaosProposalsCount(
        @Res() res: Response,
        @Req() req: Request,
        @Param('daoIpfsHash') daoIpfsHash: string) {
        const dpProposalRepository = <IDbDaoRepository>DI_CONTAINER.resolve('dbDaoRepository');
        const num = await dpProposalRepository.countProposals(daoIpfsHash);
        return { count: num.toFixed(0) };
    }

    @Get('/:daoIpfsHash/proposals')
    async getProposalHeaders(
        @Res() res: Response,
        @Req() req: Request,
        @Param('daoIpfsHash') daoIpfsHash: string,
        @QueryParam('offset') offset: number,
        @QueryParam('limit') limit: number,
        @QueryParam('filter') filter?: string) {
        const dpProposalRepository = <IDbProposalRepository>DI_CONTAINER.resolve('dbProposalRepository');
        const proposals = await dpProposalRepository.findProposalsIpfsHashes(daoIpfsHash, offset, limit, filter);
        return proposals.map((_) => { return { ipfsHash: _ }});
    }

    @Get('/all/count')
    async countDaos(
        @Res() res: Response,
        @Req() req: Request) {
        const dbDaoRepository = <IDbDaoRepository>DI_CONTAINER.resolve('dbDaoRepository');
        const proposalCount = await dbDaoRepository.countDaos();
        return { count: proposalCount.toFixed(0) };
    }

    @Get('/:daoIpfsHash/proposals/count')
    async countDaoProposals(
        @Res() res: Response,
        @Req() req: Request,
        @Param('daoIpfsHash') daoIpfsHash: string) {
        const dpProposalRepository = <IDbProposalRepository>DI_CONTAINER.resolve('dbProposalRepository');
        const proposalCount = await dpProposalRepository.countProposals(daoIpfsHash);
        return { count: proposalCount.toFixed(0) };
    }

    @Get('/:daoIpfsHash/treasury')
    async getDaoTreasuryAssets(
            @Res() res: Response,
            @Req() req: Request,
            @Param('daoIpfsHash') daoIpfsHash: string) {
        const dbDaoRepository = <IDbDaoRepository>DI_CONTAINER.resolve('dbDaoRepository');
        const dao = await dbDaoRepository.findDao(daoIpfsHash);
        if (dao) {
            if (dao.ipfsDao.clientDao.contractAddress) {
                const networkAssetsService = <NetworkAssetsService>DI_CONTAINER.resolve('networkAssetsService');
                const chainId = dao.ipfsDao.clientDao.token.chainId;
                const isDevelopmentMode = getBooleanProperty('IS_DEVELOPMENT_MODE');
                let assets;
                if (isDevelopmentMode) {
                    assets = await networkAssetsService
                        .getAssetsService('137')
                        .getAssets('0x9c8071143174f6bdef8917cc985a21c350fc11de');
                } else {
                    assets = await networkAssetsService
                        .getAssetsService(chainId)
                        .getAssets(dao.ipfsDao.clientDao.contractAddress);
                }
                const networkProviderService = <NetworkProviderService>DI_CONTAINER.resolve('networkProviderService');
                const balance = await networkProviderService.getNetworkProvider(chainId).getProvider().getBalance(dao.ipfsDao.clientDao.contractAddress);
                const balanceFormatted = ethers.formatEther(balance);
                const mapperService = <IMapperService>DI_CONTAINER.resolve('mapperService');
                const assetDtos =  assets.map((_) => mapperService.toAssetDto(_));
                return new DaoAssetsDto(
                    assetDtos,
                    balanceFormatted,
                    chainId,
                );
            } else {
                LOGGER.debug(`Getting reasury assets failed. Dao with ipfsHash ${daoIpfsHash} is not on-chain`);
            }
        } else {
            LOGGER.debug(`Getting treasury assets failed. Dao not found for ipfsHash: ${daoIpfsHash}`);
            return [];
        }
    }
}