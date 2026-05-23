import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateSurveyDto } from './dto/create-survey.dto';

@Injectable()
export class SurveysService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createSurveyDto: CreateSurveyDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.from('surveys').insert([
      {
        ...createSurveyDto,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
    return { id: data[0]?.id, success: true };
  }

  async findAll(page = 1, limit = 50) {
    const supabase = this.supabaseService.getClient();

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
      .from('surveys')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw error;
    return {
      data,
      total: count,
      page,
      limit,
    };
  }

  async getAnalytics() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('surveys')
      .select('*');

    if (error) throw error;

    // Compute analytics
    const analytics = {
      totalResponses: data.length,
      q1Distribution: this.countField(data, 'q1_reason'),
      q2Distribution: this.countField(data, 'q2_confidence'),
      q3Distribution: this.countField(data, 'q3_decision'),
      q4Distribution: this.countField(data, 'q4_doubt'),
      q5Distribution: this.countField(data, 'q5_improvement'),
      industryDistribution: this.countField(data, 'industry'),
    };

    return analytics;
  }

  private countField(data: any[], field: string): Record<string, number> {
    return data.reduce((acc, item) => {
      const value = item[field];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }
}
