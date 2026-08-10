import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function initDb() {
  const { error } = await supabase.rpc('exec_sql', { query_text: 'SELECT 1' });
  if (error) {
    console.error('Database init error:', error.message);
    throw error;
  }
  console.log('Supabase connected');
}

export async function query(queryStr: string, params: unknown[] = []) {
  let sql = queryStr;
  let idx = 0;
  sql = sql.replace(/\?/g, () => {
    const p = params[idx++];
    if (typeof p === 'string') return `'${p.replace(/'/g, "''")}'`;
    if (p === null || p === undefined) return 'NULL';
    return String(p);
  });
  const { data, error } = await supabase.rpc('exec_sql', { query_text: sql });
  if (error) throw error;
  return (data as Record<string, unknown>[]) ?? [];
}

export async function run(queryStr: string, params: unknown[] = []) {
  let sql = queryStr;
  let idx = 0;
  sql = sql.replace(/\?/g, () => {
    const p = params[idx++];
    if (typeof p === 'string') return `'${p.replace(/'/g, "''")}'`;
    if (p === null || p === undefined) return 'NULL';
    return String(p);
  });
  const { error } = await supabase.rpc('exec_sql', { query_text: sql });
  if (error) throw error;
}

export async function get(queryStr: string, params: unknown[] = []) {
  const rows = await query(queryStr, params);
  return (rows as Record<string, unknown>[])[0] ?? null;
}
