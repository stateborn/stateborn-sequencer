import { Body, Get, JsonController, Param, Post, Req, Res } from 'routing-controllers';
import { CreateProposalDto } from './dto/create-proposal-dto';
import { CreateProposalService } from '../application/create-proposal-service';
import { DI_CONTAINER } from '../infrastructure/di/awilix-config-service';
import { IMapperService } from '../domain/service/i-mapper-service';
import { CreateVoteDto } from './dto/create-vote-dto';
import { IDbVoteRepository } from '../domain/repository/i-db-vote-repository';
import { CreateVoteService } from '../application/create-vote-service';
import { ProposalResultService } from '../application/proposal-result-service';
import { GetProposalService } from '../application/get-proposal-service';
import { Response } from 'express-serve-static-core';
import { ProposalReportDto } from './dto/report/proposal-report-dto';
import { ProposalDto } from './dto/proposal-dto';

@JsonController('/api/rest/v1/proposal')
export class ProposalController {

    @Post('/')
    // @ResponseSchema(RegisterCompanyResultDto)
    // @ResponseSchema(ErrorDto, { statusCode: 400 })
    // @OpenAPI({
    //     description: 'Find companies suggestions.',
    //     responses: {
    //         400: { description: `Company register failed. Error codes:
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
    async createProposal(
            @Res() res: Response,
            @Req() req: Request,
            @Body({ required: true, options: { limit: '5MB' } }) createProposalDto: CreateProposalDto) {
        const createProposalService = <CreateProposalService>DI_CONTAINER.resolve('createProposalService');
        await createProposalService.createProposal(createProposalDto);
        return res.sendStatus(200);
    }

    @Get('/:ipfsHash')
    async getProposal(
            @Res() res: Response,
            @Req() req: Request,
            @Param('ipfsHash') ipfsHash: string): Promise<ProposalDto | undefined> {
        const getProposalService = <GetProposalService>DI_CONTAINER.resolve('getProposalService');
        return getProposalService.getProposal(ipfsHash);
    }

    @Get('/:ipfsHash/report')
    async getProposalReport(
        @Res() res: Response,
        @Req() req: Request,
        @Param('ipfsHash') ipfsHash: string): Promise<ProposalReportDto | undefined> {
        const getProposalService = <GetProposalService>DI_CONTAINER.resolve('getProposalService');
        return getProposalService.getProposalReport(ipfsHash);
    }

    @Post('/:ipfsHash/vote')
    async vote(
            @Res() res: Response,
            @Req() req: Request,
            @Body({ required: true }) createVoteDto: CreateVoteDto,
            @Param('ipfsHash') ipfsHash: string) {
        const createVoteService = <CreateVoteService>DI_CONTAINER.resolve('createVoteService');
        return await createVoteService.createVote(createVoteDto);
    }

    @Get('/:ipfsHash/votes')
    async getVotes(
        @Res() res: Response,
        @Req() req: Request,
        @Param('ipfsHash') ipfsHash: string) {
        const dbVoteRepository = <IDbVoteRepository>DI_CONTAINER.resolve('dbVoteRepository');
        const mapperService = <IMapperService>DI_CONTAINER.resolve('mapperService');
        const votes = await dbVoteRepository.findVotes(ipfsHash, 0, 10);
        return votes.map((_) => mapperService.toVoteDto(_));
    }

    @Get('/:ipfsHash/:userAddress/votes')
    async getUserVote(
            @Res() res: Response,
            @Req() req: Request,
            @Param('ipfsHash') ipfsHash: string,
            @Param('userAddress') userAddress: string) {
        const dbVoteRepository = <IDbVoteRepository>DI_CONTAINER.resolve('dbVoteRepository');
        const mapperService = <IMapperService>DI_CONTAINER.resolve('mapperService');
        const votes = await dbVoteRepository.findUserAddressVotes(ipfsHash, userAddress);
        return votes.map((_) => mapperService.toVoteDto(_));
    }

    @Get('/:ipfsHash/result')
    async getProposalResult(
        @Res() res: Response,
        @Req() req: Request,
        @Param('ipfsHash') ipfsHash: string) {
        const proposalResultService = <ProposalResultService>DI_CONTAINER.resolve('proposalResultService');
        return proposalResultService.calculateProposalResults(ipfsHash);
    }
}