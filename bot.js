const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')
const OWNER_NUMBER = '22663263977'
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session')
    const sock = makeWASocket({ auth: state })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', async (u) => {
        if (u.qr) {
            console.log("=== SCANNE CE QR CODE ===")
            qrcode.generate(u.qr, {small: true})
        }
        if (u.connection === 'open') {
            console.log('Bot connecté!')
            await sock.sendMessage(OWNER_NUMBER+'@s.whatsapp.net', {text: '✅ Remi-bot en ligne 24h/24! Envoie lancestatut'})
        }
    })
    const mesStatuts = ["🔥 Nouvel arrivage dispo!","Livraison partout Burkina 🚚","Promo 1 acheté = 1 cadeau","Stock limité!","Qualité garantie ❤️","Contacte-moi vite","Ouvert jusqu'à 22h","Merci fidèles 🙏","Article 9 dispo","Article 10","Nouveauté 11","Nouveauté 12","Nouveauté 13","Nouveauté 14","Nouveauté 15","Nouveauté 16","Nouveauté 17","Nouveauté 18","Nouveauté 19","Dernier du jour!"]
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return
        const texte = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').toLowerCase()
        const jid = msg.key.remoteJid
        if (texte.includes('bonjour') || texte.includes('bjr') || texte.includes('salut') || texte.includes('cc')) {
            await sock.sendMessage(jid, { text: 'Oui bonjour comment vous allez? 😊' })
        }
        if (jid === 'status@broadcast') {
            await sock.sendMessage(jid, { react: { text: '❤️', key: msg.key } })
        }
        if (texte === 'lancestatut' && jid.includes(OWNER_NUMBER)) {
            let i = 0
            await sock.sendMessage(jid, {text: '✅ 20 statuts lancés, 1 toutes les 5 min'})
            setInterval(async () => {
                if(i >= 20) return
                await sock.sendMessage('status@broadcast', {text: mesStatuts[i]})
                i++
            }, 5*60*1000)
        }
    })
}
startBot()
