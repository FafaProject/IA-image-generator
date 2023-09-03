const apiKey = "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";

const maxImgs = 4;
let selectImg = null;

function getRandomNumber(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function desactivarBotonGenerar(){
    document.getElementById("generar").disabled = true;
}

function activarBotonGenerar(){
    document.getElementById("generar").disabled = false;
}

function  limpiarImagenes(){
    const imgs = document.getElementById("img-grid");
    imgs.innerHTML = ""
}

async function generarImagenes(input){
    desactivarBotonGenerar();
    limpiarImagenes();

    const cargando = document.getElementById("cargando");
    cargando.style.display= "block";

    const urlImgs = [];

    for(let i = 0; i < maxImgs; i++){
        const random = getRandomNumber(1, 10000);
        const prompt = `${input} ${random}`;
        const respuesta = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}` ,
                },
                body: JSON.stringify({ inputs: prompt}),
            }
        );
    
        if(!respuesta.ok){
            alert("ERROR APOCALIPTICO AL INTENTAR CREAR LA/S IMAGEN/ES");
        }
    
        const blob = await respuesta.blob();
        const imgUrl = URL.createObjectURL(blob)
        urlImgs.push(imgUrl);

        const img = document.createElement("img")
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => descargarImagenes(imgUrl, i);
        document.getElementById("img-grid").appendChild(img);

    }

    cargando.style.display = "none";
    activarBotonGenerar();

    selectImg = null;

}

document.getElementById("generar").addEventListener('click', () =>{
    const input = document.getElementById("user-prompt").value;
    generarImagenes(input);
})

function descargarImagenes(imgUrl, imageNumber){
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `image-${imageNumber} + 1.jpg`;
    link.click();
}