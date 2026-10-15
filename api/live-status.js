const CACHE_MS=10*60*1000;
let cached={expires:0,data:{live:false,videoId:null}};
export default async function handler(req,res){
 res.setHeader('Cache-Control','public, s-maxage=600, stale-while-revalidate=120');
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 const override=process.env.YOUTUBE_LIVE_VIDEO_ID;
 if(override&&/^[\w-]{11}$/.test(override))return res.json({live:true,videoId:override,source:'override'});
 if(Date.now()<cached.expires)return res.json(cached.data);
 const key=process.env.YOUTUBE_API_KEY,channelId=process.env.YOUTUBE_CHANNEL_ID;
 if(!key||!channelId)return res.json({live:false,videoId:null,configured:false});
 try{
  const url=new URL('https://www.googleapis.com/youtube/v3/search');
  for(const [k,v] of Object.entries({part:'snippet',channelId,eventType:'live',type:'video',maxResults:'1',key}))url.searchParams.set(k,v);
  const response=await fetch(url,{signal:AbortSignal.timeout(9000)});
  if(!response.ok)throw new Error('YouTube lookup failed');
  const json=await response.json();const id=json.items?.[0]?.id?.videoId;
  cached={expires:Date.now()+CACHE_MS,data:{live:Boolean(id),videoId:id||null}};
  return res.json(cached.data);
 }catch{return res.status(503).json({error:'Live status temporarily unavailable',live:false,videoId:null})}
}
