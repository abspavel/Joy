import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ywkcfpdoduaipyzruhnz.supabase.co', 'sb_publishable_bZA166IynMCCEysBIm-Gog_S_GBKLfG');
async function run() {
  const { data } = await supabase.from('hero_content').select('*').single();
  console.log(data);
}
run();
