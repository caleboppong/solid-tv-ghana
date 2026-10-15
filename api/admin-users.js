import {createClient} from '@supabase/supabase-js';
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const url=process.env.SUPABASE_URL||process.env.VITE_SUPABASE_URL;
  const service=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!service)return res.status(503).json({error:'Admin service is not configured'});
  const token=req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  if(!token)return res.status(401).json({error:'Authentication required'});
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:{user},error:authError}=await admin.auth.getUser(token);
  if(authError||!user)return res.status(401).json({error:'Invalid session'});
  const {data:actor}=await admin.from('profiles').select('role').eq('id',user.id).single();
  if(!['admin','super_admin'].includes(actor?.role))return res.status(403).json({error:'Admin role required'});
  const {action,email,password,role,userId}=req.body||{};
  const permitted=['visitor','staff','editor','admin',...(actor.role==='super_admin'?['super_admin']:[])];
  try{
    if(action==='create'){
      if(!email||!password||password.length<12||!permitted.includes(role)||role==='super_admin')return res.status(400).json({error:'Invalid email, role or password (minimum 12 characters)'});
      const {data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true});
      if(error)throw error;
      const {error:profileError}=await admin.from('profiles').upsert({id:data.user.id,email:data.user.email,role});
      if(profileError){await admin.auth.admin.deleteUser(data.user.id);throw profileError}
      return res.json({message:'Staff account created'});
    }
    if(!userId||userId===user.id)return res.status(400).json({error:'Invalid target account'});
    const {data:target}=await admin.from('profiles').select('role').eq('id',userId).single();
    if(!target)return res.status(404).json({error:'Account not found'});
    if(target.role==='super_admin'&&actor.role!=='super_admin')return res.status(403).json({error:'Cannot manage Super Admin'});
    if(action==='role'){
      if(!permitted.includes(role))return res.status(400).json({error:'Invalid role'});
      const {error}=await admin.from('profiles').update({role}).eq('id',userId);if(error)throw error;
      return res.json({message:'Role updated'});
    }
    if(action==='delete'){
      if(target.role==='super_admin')return res.status(403).json({error:'Super Admin deletion is disabled'});
      const {error}=await admin.auth.admin.deleteUser(userId);if(error)throw error;
      return res.json({message:'Account deleted'});
    }
    return res.status(400).json({error:'Unknown action'});
  }catch(e){return res.status(400).json({error:e.message||'Operation failed'})}
}
