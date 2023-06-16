import { Body, Get, JsonController, Param, Post, QueryParam, Req, Res } from 'routing-controllers';
import { DI_CONTAINER } from '../infrastructure/di/awilix-config-service';
import { Response } from 'express-serve-static-core';
import { CreateDaoDto } from './dto/dao/create-dao-dto';
import { CreateDaoService } from '../application/dao/create-dao-service';
import { IMapperService } from '../domain/service/i-mapper-service';
import { IDbDaoRepository } from '../domain/repository/i-db-dao-repository';
import { IDbProposalRepository } from '../domain/repository/i-db-proposal-repository';
import { map } from '@automapper/core/lib/mappings/map';
import { ProposalHeaderDto } from './dto/proposal/proposal-header-dto';

@JsonController('/api/rest/v1/dao')
export class DaoController {

    @Post('/')
    // @ResponseSchema(RegisterCompanyResultDto)
    // @ResponseSchema(ErrorDto, { statusCode: 400 })
    // @OpenAPI({
    //     description: 'Find companies suggestions.',
    //     responses: {
    //         400: { description: `Company register failed. Error   codes:
    //            <ul>
    //               <li>COMPANY_ALREADY_REGISTERED = CompanyRegistrationError_0</li>
    //               <li>ADMIN_NOT_PROVIDED = CompanyRegistrationError_1</li>
    //               <li>ADMIN_EMAIL_ALREADY_USED = CompanyRegistrationError_2</li>
    //               <li>EMPLOYEE_EMAIL_ALREADY_USED = CompanyRegistrationError_3</li>
    //               <li>UNEXPECTED_DATABASE_ERROR = CompanyRegistrationError_4</li>
    //               <li>USERS_TO_REGISTER_NOT_ACCEPTED_TERMS_AND_CONDITIONS = CompanyRegistrationError_5</li>
    //            </ul>
    //         ` },
    //     },
    // })
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

}