import { Body, Get, JsonController, Param, Post, QueryParam, Req, Res } from 'routing-controllers';
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
import { WrongVotingPowerError } from '../application/error/wrong-voting-power-error';

@JsonController('/api/rest/v1/proposal')
export class ProposalController {

    @Post('/')
    async createProposal(
            @Res() res: Response,
            @Req() req: Request,
            @Body({ required: true, options: { limit: '2MB' } }) createProposalDto: CreateProposalDto) {
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
            @Param('ipfsHash') ipfsHash: string,) {
        const createVoteService = <CreateVoteService>DI_CONTAINER.resolve('createVoteService');
        try {
            return await createVoteService.createVote(createVoteDto);
        } catch (error) {
            if (error instanceof WrongVotingPowerError) {
                return res.status(400).send({
                    errorCode: '1',
                    readVotingPower: error.readVotingPower,
                    proposalBlock: error.proposalBlock,
                });
            } else {
                throw error;
            }
        }
    }

    @Get('/:ipfsHash/votes')
    async getVotes(
            @Res() res: Response,
            @Req() req: Request,
            @Param('ipfsHash') ipfsHash: string,
            @QueryParam('offset') offset: number,
            @QueryParam('limit') limit: number) {
        const dbVoteRepository = <IDbVoteRepository>DI_CONTAINER.resolve('dbVoteRepository');
        const mapperService = <IMapperService>DI_CONTAINER.resolve('mapperService');
        const votes = await dbVoteRepository.findVotes(ipfsHash, offset, limit);
        return votes.map((_) => mapperService.toVoteDto(_));
    }

    @Get('/:ipfsHash/votes/all/count')
    async countVotes(
            @Res() res: Response,
            @Req() req: Request,
            @Param('ipfsHash') ipfsHash: string) {
        const dbVoteRepository = <IDbVoteRepository>DI_CONTAINER.resolve('dbVoteRepository');
        const proposalCount = await dbVoteRepository.countVotes(ipfsHash);
        return { count: proposalCount.toFixed(0) };
    }

    @Get('/:ipfsHash/votes/all/count/distinct')
    async countDistinctVotes(
            @Res() res: Response,
            @Req() req: Request,
            @Param('ipfsHash') ipfsHash: string) {
        const dbVoteRepository = <IDbVoteRepository>DI_CONTAINER.resolve('dbVoteRepository');
        const proposalCount = await dbVoteRepository.countDistinctVotes(ipfsHash);
        return { count: proposalCount };
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