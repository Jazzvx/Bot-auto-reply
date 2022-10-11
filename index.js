const Discord = require('discord.js')
const client = new Discord.Client()
const db = require('quick.db')
const prefix = ".."



client.on('message', message => {
if(message.content.startsWith(prefix + "add")){
if(!message.member.hasPermission('ADMINISTRATOR')) return
message.channel.send(`Masukan kata`)
message.channel.awaitMessages((msg) => msg.author.id === message.author.id, {max: 1}).then(async c => {
var ccc = c.first().content
let database = await db.fetch(`ar_${message.guild.id}`)
if(database && database.find(x => x.message === ccc.toLowerCase())) return message.channel.send(`Berhasil menambahkan auto responder`)
message.channel.send(`Masukan balasan`)
message.channel.awaitMessages((msg) => msg.author.id === message.author.id, {max: 1}).then(async(d) => {

const em = new Discord.MessageEmbed()
.setTitle(`Auto responder`)
.setDescription(` \n Kata: ${c.first().content} \n Balasan: ${d.first().content}`)
.setColor('RANDOM')
.setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
.setTimestamp()

db.push(`ar_${message.guild.id}`, {
message: c.first().content,
res: d.first().content
})
message.channel.send(em)

})
})
}
})

client.on('message', async message => {
if(message.content.startsWith(prefix  + "remove")){
if(!message.member.hasPermission('ADMINISTRATOR')) return
var args = message.content.split(' ').slice(1).join(' ')
if(!args) return
let database = await db.fetch(`ar_${message.guild.id}`)
if(database){
let data = database.find(x => x.message === args.toLowerCase())
if(!data) return message.channel.send(`Terjadi kesalahan`)
let value = database.indexOf(data)
   delete database[value]
 
   var filter = database.filter(x => {
     return x != null && x != ''
   })
 
   db.set(`ar_${message.guild.id}`, filter)
message.channel.send(`Berhasil menghapus salah satu kata`)
}
}
})

client.on('message', async message => {
if(message.content.startsWith(prefix + "remove-all")){
if(!message.member.hasPermission('ADMINISTRATOR')) return
let database = await db.fetch(`ar_${message.guild.id}`)
if(database === null){
message.channel.send(`List kata tidak ditemukan`)
} else {
db.delete(`ar_${message.guild.id}`)
message.channel.send(`Semua daftar auto responder telah di hapus`)
}
}
})

client.on('message', async message => {
if(message.content.startsWith(prefix + "list")){
const data = await db.fetch(`ar_${message.guild.id}`)
if(data === null){
message.channel.send(`Daftar tidak ditemukan`)
} else {
let array = [];
data.forEach(x => {
array.push(`
Kata: ${x.message}\nBalasan: ${x.res}
`)
})
var embed = new Discord.MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
.setDescription(`${array.join('\n')}\nJumlah auto responder: ${data.length}`)
.setTimestamp()
.setFooter(message.author.tag, message.author.avatarURL({dynamic: true}))
message.channel.send(embed)
}
}
})

client.on('message', async message => {
let data = db.get(`ar_${message.guild.id}`)
  if(data) {
let word = data.find(x => x.message === message.content.toLowerCase())
    if(word){
        message.channel.send(word.res)
    }
  }
    
})
client.login(process.env.token)