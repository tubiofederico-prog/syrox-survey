import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mmwtbifoiieketycfbjx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1td3RiaWZvaWlla2V0eWNmYmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzOTA1OTEsImV4cCI6MjA5NDk2NjU5MX0.Q14PRrv0eoDAfVhVYGfwCyepVvgJF8l7FYkCZ95fx6I';

export const supabase = createClient(supabaseUrl, supabaseKey);
