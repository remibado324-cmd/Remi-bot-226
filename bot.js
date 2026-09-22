const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const P = require("pino")
async function startBot(){
 const {state,saveCreds}=await useMultiFileAuthState('session')
 const sock=makeWASocket({auth:state,logger:P({level:'silent'}),printQRInTerminal:true,browser:["Remi-Bot 226","Chrome","1.0"]})
 sock.ev.on('creds.update',saveCreds)
 sock.ev.on('connection.update',u=>{if(u.connection==='open')console.log('REMI-BOT 226 EN LIGNE')})
 sock.ev.on('messages.upsert',async m=>{
  const msg=m.messages[0]; if(!msg.message||msg.key.fromMe)return
  const t=msg.message.conversation||msg.message.extendedTextMessage?.text||""
  if(['bonjour','menu','salut'].includes(t.toLowerCase())) await sock.sendMessage(msg.key.remoteJid,{text:'Salut! REMI-BOT 226 🇧🇫 est en ligne ✅'})
 })
}
startBot()
