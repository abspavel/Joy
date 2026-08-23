import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ywkcfpdoduaipyzruhnz.supabase.co', 'sb_publishable_bZA166IynMCCEysBIm-Gog_S_GBKLfG');
async function run() {
  const { data, error } = await supabase.from('projects').select('*').limit(1);
  console.log(data, error);
}
run();
