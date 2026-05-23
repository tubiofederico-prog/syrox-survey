import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateSurveyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  q1_reason: string;

  @IsString()
  q2_confidence: string;

  @IsString()
  q3_decision: string;

  @IsString()
  q4_doubt: string;

  @IsString()
  q5_improvement: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
