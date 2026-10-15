import {defineConfig,loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import adminUsers from './api/admin-users.js';
import liveStatus from './api/live-status.js';

function localApi(){
  return {name:'solid-tv-local-api',configureServer(server){
    server.middlewares.use(async(req,res,next)=>{
      const path=(req.url||'').split('?')[0];
      const handler=path==='/api/admin-users'?adminUsers:path==='/api/live-status'?liveStatus:null;
      if(!handler)return next();
      const chunks=[];
      try{
        for await(const chunk of req)chunks.push(chunk);
        const raw=Buffer.concat(chunks).toString('utf8');
        req.body=raw?JSON.parse(raw):{};
        res.status=(code)=>{res.statusCode=code;return res};
        res.json=(data)=>{if(!res.headersSent)res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(data));return res};
        await handler(req,res);
      }catch(error){
        if(!res.headersSent){res.statusCode=500;res.setHeader('Content-Type','application/json; charset=utf-8')}
        if(!res.writableEnded)res.end(JSON.stringify({error:error?.message||'Internal server error'}));
      }
    });
  }};
}
export default defineConfig(({mode})=>{
  const env=loadEnv(mode,process.cwd(),'');
  for(const key of ['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','YOUTUBE_API_KEY','YOUTUBE_CHANNEL_ID','YOUTUBE_LIVE_VIDEO_ID']){
    if(env[key]!==undefined)process.env[key]=env[key];
  }
  return {plugins:[react(),localApi()]};
});
