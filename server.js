import express from "express"

const app = express()
const PORT = process.env.PORT || 3000

/* API: fetch games list */

app.get("/api/games", async (req,res)=>{

try{

const r = await fetch("https://raw.githubusercontent.com/swarmintelli/Unblocked-Games-CDN/main/games.json")
const data = await r.json()

res.json(data)

}catch{

res.status(500).json({error:"failed to load games"})

}

})

/* WEBSITE */

app.get("/",(req,res)=>{

res.send(`

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Dashboard</title>
<meta name="viewport" content="width=device-width,initial-scale=1">

<style>

body{
margin:0;
font-family:Segoe UI;
background:#0f172a;
color:white;
}

header{
display:flex;
justify-content:space-between;
align-items:center;
padding:15px 25px;
background:#020617;
border-bottom:1px solid #1e293b;
}

input{
padding:8px;
border:none;
border-radius:6px;
background:#1e293b;
color:white;
}

.container{
padding:25px;
}

.grid{
display:grid;
grid-template-columns:repeat(auto-fill,minmax(180px,1fr));
gap:20px;
}

.card{
background:#1e293b;
border-radius:12px;
overflow:hidden;
cursor:pointer;
transition:.2s;
position:relative;
}

.card:hover{
transform:scale(1.05);
}

.card img{
width:100%;
height:120px;
object-fit:cover;
}

.title{
padding:8px;
text-align:center;
font-size:14px;
}

.favorite{
position:absolute;
top:8px;
right:8px;
font-size:18px;
cursor:pointer;
}

#player{
display:none;
height:100vh;
}

iframe{
width:100%;
height:calc(100vh - 50px);
border:none;
}

.playerbar{
background:#020617;
padding:10px;
display:flex;
gap:10px;
}

button{
background:#2563eb;
border:none;
padding:8px 12px;
border-radius:6px;
color:white;
cursor:pointer;
}

button:hover{
background:#1d4ed8;
}

</style>

</head>

<body>

<header>
<div>Dashboard</div>
<input id="search" placeholder="Search games">
</header>

<div class="container">
<div id="games" class="grid"></div>
</div>

<div id="player">

<div class="playerbar">
<button onclick="goBack()">Back</button>
<button onclick="fullscreenGame()">Fullscreen</button>
</div>

<iframe id="frame"></iframe>

</div>

<script>

/* panic key */

document.addEventListener("keydown",e=>{
if(e.key==="\\\\"){
window.location="https://google.com"
}
})

let games=[]
let favorites=JSON.parse(localStorage.getItem("favorites")||"[]")

const grid=document.getElementById("games")
const search=document.getElementById("search")

async function load(){

const r=await fetch("/api/games")
games=await r.json()

render(games)

}

function render(list){

grid.innerHTML=""

list.forEach(g=>{

const card=document.createElement("div")
card.className="card"

const star=favorites.includes(g.name)?"⭐":"☆"

card.innerHTML=\`
<div class="favorite">\${star}</div>
<img loading="lazy" src="\${g.game_image_icon}">
<div class="title">\${g.name}</div>
\`

card.onclick=()=>play(g.iframe)

card.querySelector(".favorite").onclick=(e)=>{
e.stopPropagation()
toggleFavorite(g.name)
}

grid.appendChild(card)

})

}

function toggleFavorite(name){

if(favorites.includes(name))
favorites=favorites.filter(f=>f!==name)
else
favorites.push(name)

localStorage.setItem("favorites",JSON.stringify(favorites))

render(games)

}

search.oninput=()=>{

const q=search.value.toLowerCase()

render(
games.filter(g=>g.name.toLowerCase().includes(q))
)

}

function play(url){

document.querySelector(".container").style.display="none"
document.getElementById("player").style.display="block"

document.getElementById("frame").src=url

}

function goBack(){

document.getElementById("player").style.display="none"
document.querySelector(".container").style.display="block"

document.getElementById("frame").src=""

}

function fullscreenGame(){

document.getElementById("frame").requestFullscreen()

}

load()

</script>

</body>
</html>

`)

})

app.listen(PORT,()=>{
console.log("Server running on http://localhost:"+PORT)
})