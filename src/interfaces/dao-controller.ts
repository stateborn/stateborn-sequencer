import { Body, Get, JsonController, Param, Post, Req, Res } from 'routing-controllers';
import { DI_CONTAINER } from '../infrastructure/di/awilix-config-service';
import { Response } from 'express-serve-static-core';
import { CreateDaoDto } from './dto/dao/create-dao-dto';
import { CreateDaoService } from '../application/dao/create-dao-service';
import { IMapperService } from '../domain/service/i-mapper-service';
import { IDbDaoRepository } from '../domain/repository/i-db-dao-repository';
import { IDbProposalRepository } from '../domain/repository/i-db-proposal-repository';
import { map } from '@automapper/core/lib/mappings/map';

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
    async getDaos(
        @Res() res: Response,
        @Req() req: Request) {
        const dpProposalRepository = <IDbDaoRepository>DI_CONTAINER.resolve('dbDaoRepository');
        const mapperService = <IMapperService>DI_CONTAINER.resolve('mapperService');
        const proposals = await dpProposalRepository.findDaos(0, 10);
        return proposals.map((_) => mapperService.toDaoDto(_));
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
    async getProposals(
        @Res() res: Response,
        @Req() req: Request,
        @Param('daoIpfsHash') daoIpfsHash: string) {
        const dpProposalRepository = <IDbProposalRepository>DI_CONTAINER.resolve('dbProposalRepository');
        const mapperService = <IMapperService>DI_CONTAINER.resolve('mapperService');
        const proposals = await dpProposalRepository.findProposals(daoIpfsHash, 0, 10);
        return proposals.map((_) => mapperService.toProposalDto(_));
    }



}