import { Body, Get, JsonController, Param, Post, Put, Req, Res } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { CreateProposalDto } from './dto/create-proposal-dto';
import { CreateProposalService } from '../application/create-proposal-service';
import { DI_CONTAINER } from '../infrastructure/di/awilix-config-service';
import { IDbProposalRepository } from '../domain/repository/i-db-proposal-repository';
import { IMapperService } from '../domain/service/i-mapper-service';
import { ProposalDto } from './dto/proposal-dto';
import { CreateVoteDto } from './dto/create-vote-dto';
import { IDbVoteRepository } from '../domain/repository/i-db-vote-repository';
import { CreateVoteService } from '../application/create-vote-service';

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
            @Body({ required: true }) createProposalDto: CreateProposalDto) {
        const createProposalService = <CreateProposalService>DI_CONTAINER.resolve('createProposalService');
        await createProposalService.createProposal(createProposalDto);
        // return await ipfs.add(body);
        return '';
    }

    @Get('/')
    async getProposals(
        @Res() res: Response,
        @Req() req: Request) {
        const dpProposalRepository = <IDbProposalRepository>DI_CONTAINER.resolve('dbProposalRepository');
        const mapperService = <IMapperService>DI_CONTAINER.resolve('mapperService');
        const proposals = await dpProposalRepository.findProposals(0, 10);
        return proposals.map((_) => mapperService.toProposalDto(_));
    }

    @Get('/:ipfsHash')
    async getProposal(
            @Res() res: Response,
            @Req() req: Request,
            @Param('ipfsHash') ipfsHash: string): Promise<ProposalDto | undefined> {
        const dpProposalRepository = <IDbProposalRepository>DI_CONTAINER.resolve('dbProposalRepository');
        const mapperService = <IMapperService>DI_CONTAINER.resolve('mapperService');
        const proposal = await dpProposalRepository.findProposalByIpfsHash(ipfsHash);
        return proposal ? mapperService.toProposalDto(proposal) : undefined;
    }


    @Post('/:ipfsHash/vote')
    async vote(
            @Res() res: Response,
            @Req() req: Request,
            @Body({ required: true }) createVoteDto: CreateVoteDto,
            @Param('ipfsHash') ipfsHash: string) {
        const createVoteService = <CreateVoteService>DI_CONTAINER.resolve('createVoteService');
        await createVoteService.createVote(createVoteDto);
        return '';
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
}