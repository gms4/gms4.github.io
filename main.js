const fetchText = async (url) => {

  const response = await fetch(url);
  return await response.text();

};

//pegando as cores dos partidos
//fonte https://pt.wikipedia.org/wiki/Predefinição:Cor_de_partido_pol%C3%ADtico/BRA
function getPartyColor (party) {

    switch (party) {

      case "MDB": 
      
        return "#00aa4f"

      case "PL":

        return "#FF4500"

      case "PSDB":

        return "#0080FF"

      case "PSD":

        return "#FFA500"

      case "PDT":

        return "#FE8E6D"

      case "PROS":

        return "#f48c24"

      case "PT":

        return "#c4122d"

      case "CIDADANIA":

        return "#ec008c"

      case "DEM":

        return "#97e500ff"

      case "PODEMOS":

        return "#31b44b"

      case "PP":

        return "#0067A5"

      case "REPUBLICANOS":

        return "#115E80"

      case "PSL":

        return "#054577"

      case "REDE":

        return "#00C2BB"

        default: return "#000000"
    }


}

//usando interpolação pra plotar os círculos

const width = 850;
const height = 650;

const range = (index) => {
  if(index < 10) return [0, 10]
  if(index < 23) return [10, 23]
  if(index < 42) return [23, 42]
  if(index < 60) return [42, 60]
  if(index < 81) return [60, 81]
}
const getRadius = (index) => {
  if(index < 10) return 150
  if(index < 23) return 190
  if(index < 42) return 230
  if(index < 60) return 270
  if(index < 81) return 310
}

//offset = -5 é giradinha gambiarra pra não ficar tão feio assim
//não consegui estruturar direitinho pra ficar retinho
const offset = -5
const mapRange = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;
function interpolate(p0, p1, t){
  return (1-t)*p0 + t*p1;
}
const getX = (index) => {
  const angle = mapRange(index, ...range(index), 270, 90)
  return Math.sin((angle+offset) * Math.PI/180) * getRadius(index) + (width/2)
}
const getY = (index) => {
  const angle = mapRange(index, ...range(index), 270, 90)
  return Math.cos((angle+offset) * Math.PI/180) * getRadius(index) + (height)
}

//d3 aqui
//vamos pegar os dados do csv fornecido e manipulá-los
let csvData;

const csv = "./Senadores.csv";

fetchText(csv)
  .then((text) => {

    //tratar dados
    csvData = d3.csvParse(text);
    return csvData;

  })
  .then((csvData) => {

    //setando imagem do senador, nome do senador e partido e conectando com o html em img, h1 e h2 respectivamente
    let imageSenator = d3.select("img");
    let labelNameSenator = d3.select("h1");
    let labelParty = d3.select("h2");

    //usando a função do d3 select all como visto em aula p fazer o data binding
    let circles = d3.select("div").select("svg").selectAll("circle");
    circles
      .data(csvData)
      .enter()  
      .append('circle')
      .attr('r', 10)
      .attr('cx', d=>getX(d.id))
      .attr('cy', d=>getY(d.id))
      .attr('fill', d=>getPartyColor(d.siglaPart))
      .text((d) => d.nomeSenador + " " + d.siglaPart)
      .on("click", (event, d) => {
        imageSenator.attr("src", () => {
          return d.urlFoto;
        })
        
        //setando a cor do nome do partido pra ser igual a cor do partido
        //e o nome dos senadores setei em branco no html
        labelNameSenator.text(d.nomeSenador);
        labelParty
          .style("color", getPartyColor(d.siglaPart))
          .text(d.siglaPart);
      })

      //setando o reset das bordas quando o mouse sai de cima
      .on("mouseleave", (event, d) => {
        d3.select(event.target)
        .transition()
        .duration(100)
        .style('stroke-width', '0px');
      })

      //setando as bordas quando passa o mouse por cima
      .on("mouseover", (event, d) => {
        d3.select(event.target)
        .transition()
        .duration(100)
        .style('stroke', 'white')
        .style('stroke-width', '2px');
      })
  });