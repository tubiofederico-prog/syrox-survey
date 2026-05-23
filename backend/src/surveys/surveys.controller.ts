import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/surveys')
export class SurveysController {
  constructor(private surveysService: SurveysService) {}

  @Post()
  async create(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveysService.create(createSurveyDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query('page') page = 1, @Query('limit') limit = 50) {
    return this.surveysService.findAll(page, limit);
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  async getAnalytics() {
    return this.surveysService.getAnalytics();
  }
}
