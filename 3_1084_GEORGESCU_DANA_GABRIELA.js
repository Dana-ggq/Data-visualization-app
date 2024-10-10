"use-strict"
//CLASE 
class Histogram {

    #svgns; //namespace elem de tip svg
    #domElement;
    #svg;

    //dim zonei de desenat
    #width;
    #height;

    /**
    * @param {HTMLElement} domElement 
    * docElem -> unde se va desena
    */
    constructor(domElement) {
        this.#domElement = domElement;
        this.#svgns = "http://www.w3.org/2000/svg";;

        // width si height cat divul de desenat
        this.#width = this.#domElement.clientWidth;
        this.#height = this.#domElement.clientHeight;
    }

    /**
     * 
     * @param {array} data 
     * data -> datele de reprezentat in histograma
     */
    draw(data, indicator, country) {
        this.#clearDiv(this.#domElement);
        this.#createSVG();
        this.#drawHistogram(data, indicator);
        this.#drawTitle(indicator, country);
    }

    #drawTitle(indicator, country) {
        const text = document.createElementNS(this.#svgns, "text");
        text.appendChild(document.createTextNode(country + " - " + indicator));
        text.setAttribute("x", this.#width / 2 - 10);
        text.setAttribute("y", 10);
        text.setAttribute("fill", "#545454")
        text.setAttribute("font-size", "0.7em");

        //adaugam textul
        this.#svg.appendChild(text);

    }


    /**
     * stergere histograma anterioara daca exista
     * @param {HTMLElement} element 
     */
    #clearDiv(element) {
        while (element.hasChildNodes()) {
            element.removeChild(element.childNodes[0]);
        }
    }

    #createSVG() {
        this.#svg = document.createElementNS(this.#svgns, "svg");

        //redim in caz ca s-a redim browserul si nu s-a dat refresh
        this.#width = this.#domElement.clientWidth;
        this.#height = this.#domElement.clientHeight;

        //sa aiba dimensiunea divului
        this.#svg.setAttribute("width", this.#width);
        this.#svg.setAttribute("height", this.#height)

        //se adauga la div
        this.#domElement.appendChild(this.#svg);
    }

    #drawOyTitle(titleName) {
        const title = document.createElementNS(this.#svgns, "text");
        title.appendChild(document.createTextNode(titleName));
        title.setAttribute("x", 0);
        title.setAttribute("y", this.#height / 2);
        title.setAttribute("fill", "#C7D0D8")
        title.setAttribute("font-size", "0.6em");
        title.setAttribute("transform", `rotate(-90 10 ${this.#height / 2})`);
        this.#svg.appendChild(title);
    }

    #drawOyLines(yH, i) {
        const oy = document.createElementNS(this.#svgns, "line");
        oy.setAttribute("x1", 50);
        oy.setAttribute("y1", this.#height - 25 - i * yH);
        oy.setAttribute("x2", this.#width);
        oy.setAttribute("y2", this.#height - 25 - i * yH);
        oy.setAttribute("stroke", "#F8F8F8");
        oy.setAttribute("stroke-width", "1");
        this.#svg.appendChild(oy);
    }


    #drawSV(values) {
        let maxValue = Math.ceil(Math.max(...values));
        let minValue = Math.floor(Math.min(...values));
        // console.log(values)

        //draw Oy
        //pe oy un an mai putin decat primul an:
        const text = document.createElementNS(this.#svgns, "text");
        text.appendChild(document.createTextNode((minValue - 1).toString()));
        text.setAttribute("x", 15);
        text.setAttribute("y", this.#height - 25);
        text.setAttribute("fill", "#545454")
        text.setAttribute("font-size", "0.7em");
        this.#svg.appendChild(text);

        const yH = (this.#height - 25) / (maxValue - minValue + 2);
        let pos = 1;
        for (let i = minValue; i <= maxValue; i++) {
            const text = document.createElementNS(this.#svgns, "text");
            text.appendChild(document.createTextNode((i).toString()));
            text.setAttribute("x", 15);
            text.setAttribute("y", this.#height - 25 - (pos++) * yH);
            text.setAttribute("fill", "#545454")
            text.setAttribute("font-size", "0.7em");
            this.#svg.appendChild(text);

            this.#drawOyLines(yH, pos - 1);
        }
        //draw bars
        this.#drawBars(values, yH, 1, minValue - 1);
    }

    #drawPOP(values) {
        //draw Oy
        let maxValue = Math.max(...values);
        let minValue = Math.min(...values);
        // console.log(values)

        //rotunjire minim la sute de mii
        minValue = Math.floor(minValue / 100000) * 100000;
        //rotunjire maxim la sute de mii
        maxValue = Math.ceil(maxValue / 100000) * 100000;

        //se afizeaza 7 diferente rotunjite la zeci de mii
        const dif = Math.ceil((maxValue - minValue) / 70000) * 10000;

        //se face graficul pentru mii persoane (milioane val prea mare nu are loc)
        const yH = (this.#height - 25) / 9;
        //se afiseaza si cu o valoare mai jos pe poz 0 pt vizualizare mai buna
        minValue -= dif;
        for (let i = 0; i <= 8; i++) {
            const text = document.createElementNS(this.#svgns, "text");
            text.appendChild(document.createTextNode(((minValue + i * dif) / 1000).toString()));
            text.setAttribute("x", 15);
            text.setAttribute("y", this.#height - 23 - i * yH);
            text.setAttribute("fill", "#545454")
            text.setAttribute("font-size", "0.7em");
            this.#svg.appendChild(text);

            if (i != 0) {
                this.#drawOyLines(yH, i);
            }
        }

        //desenare titlu
        this.#drawOyTitle("Mii persoane");

        //desenare bare
        this.#drawBars(values, yH, dif, minValue);

    }

    #drawPIB(values) {
        //desenare oy
        let maxValue = Math.max(...values);
        let minValue = Math.min(...values);
        // console.log(values);

        //rotunjire minim la  mii
        minValue = Math.floor(minValue / 1000) * 1000;
        //rotunjire maxim la sute de mii
        maxValue = Math.ceil(maxValue / 1000) * 1000;
        const nrValues = (maxValue - minValue) / 1000 + 1;

        const yH = (this.#height - 25) / nrValues;
        for (let i = 0; i < nrValues; i++) {
            const text = document.createElementNS(this.#svgns, "text");
            text.appendChild(document.createTextNode((minValue + (i * 1000)).toString()));
            text.setAttribute("x", 15);
            text.setAttribute("y", this.#height - 23 - i * yH);
            text.setAttribute("fill", "#545454")
            text.setAttribute("font-size", "0.7em");
            this.#svg.appendChild(text);

            if (i != 0) {
                this.#drawOyLines(yH, i);
            }
        }
        //desenare titlu
        this.#drawOyTitle("Euro persoana");

        //desenare bare
        this.#drawBars(values, yH, 1000, minValue);
    }

    #drawOx(years) {
        //desenare ox
        const ox = document.createElementNS(this.#svgns, "line");
        ox.setAttribute("x1", 50);
        ox.setAttribute("y1", this.#height - 25);
        ox.setAttribute("x2", this.#width);
        ox.setAttribute("y2", this.#height - 25);
        ox.setAttribute("stroke", "#545454");
        ox.setAttribute("stroke-width", "2");
        //adaugare
        this.#svg.appendChild(ox);

        //desenare ani ox din 3 in 3
        const dist = this.#width / (Math.round(years.length / 3) + 1);
        for (let i = 0; i < years.length; i = i + 3) {
            const text = document.createElementNS(this.#svgns, "text");
            text.appendChild(document.createTextNode(years[i]));
            text.setAttribute("x", 55 + i / 3 * dist);
            text.setAttribute("y", this.#height - 10);
            text.setAttribute("fill", "#545454")
            text.setAttribute("font-size", "0.8em");
            this.#svg.appendChild(text);
        }
        const title = document.createElementNS(this.#svgns, "text");
        title.appendChild(document.createTextNode("Ani"));
        title.setAttribute("x", this.#width / 2);
        title.setAttribute("y", this.#height);
        title.setAttribute("fill", "#C7D0D8")
        title.setAttribute("font-size", "0.6em");
        this.#svg.appendChild(title);
    }

    #drawHistogram(data, indicator) {

        const values = data.map(x => x[1]);
        const years = data.map(x => x[0]);

        this.#drawOx(years);

        switch (indicator) {
            case "SV":
                this.#drawSV(values);
                break;
            case "POP":
                this.#drawPOP(values);
                break
            case "PIB":
                this.#drawPIB(values);
                break;
        }

    }

    #drawBars(values, yH, dist, minVal) {

        const barWidth = (this.#width - 65) / values.length;
        const unitHeight = yH / dist;

        for (let i = 0; i < values.length; i++) {
            const barHeight = (values[i] - minVal) * unitHeight;
            const barX = 65 + i * barWidth;
            const barY = (this.#height - 26) - barHeight;

            const bar = document.createElementNS(this.#svgns, "rect");
            bar.setAttribute("x", barX);
            bar.setAttribute("y", barY);
            bar.setAttribute("width", barWidth);
            bar.setAttribute("height", barHeight);
            bar.classList.add("bar");

            //adaugare bare
            this.#svg.appendChild(bar);

            //tooltip
            bar.addEventListener("mouseover", () => {
                const text1 = document.createElementNS(this.#svgns, "text");
                const text2 = document.createElementNS(this.#svgns, "text");
                text1.appendChild(document.createTextNode("An: " + (i + 2000)));
                text2.appendChild(document.createTextNode("Valoare: " + values[i]));

                text1.setAttribute("x", barX - barWidth / 2 + 2);
                text1.setAttribute("y", barY - 20);
                text1.setAttribute("fill", "#545454")
                text1.setAttribute("font-size", "0.6em");
                text1.setAttribute("class", "tooltiptext");

                text2.setAttribute("x", barX - barWidth / 2 + 2);
                text2.setAttribute("y", barY - 10);
                text2.setAttribute("fill", "#545454")
                text2.setAttribute("font-size", "0.6em");
                text2.setAttribute("class", "tooltiptext");


                const tooltip = document.createElementNS(this.#svgns, "rect");
                tooltip.setAttribute("x", barX - barWidth / 2);
                tooltip.setAttribute("y", barY - 32);
                tooltip.setAttribute("width", 85);
                tooltip.setAttribute("height", 30);
                tooltip.classList.add("tooltip");

                //pt ultima valoare toolipul se deneseaza inainte pentru a avea loc
                if (i === values.length - 1) {
                    tooltip.setAttribute("x", barX - 1.5 * barWidth);
                    text1.setAttribute("x", barX - 1.5 * barWidth);
                    text2.setAttribute("x", barX - 1.5 * barWidth);
                }
                this.#svg.appendChild(tooltip)
                this.#svg.appendChild(text1);
                this.#svg.appendChild(text2);

            });

            bar.addEventListener("mouseleave", () => {
                const tooltip = document.querySelectorAll(".tooltiptext, .tooltip");
                if (tooltip) {
                    for (let i = 0; i < tooltip.length; i++) {
                        tooltip[i].remove();
                    }
                }
            });
        }


    }

}


class BubbleChart {
    //marime bula -> populatie
    //ox -> pib
    //oy -> sv


    constructor(canvas) {
        this.canvas = canvas;
    }

    /**
     * 
     * @param {Array} values 
     * @param {CanvasRenderingContext2D} context 
     */
    #drawAxes(values, context) {

        const beginX = 15.5;
        const endY = this.canvas.height - 15.5;
        const startY = 12.5;

        //setari pt desenare linii si text
        context.lineWidth = 0.5;
        context.fillStyle = "#545454"
        context.textAlign = "center";
        context.font = "2px"

        //OY axa -> sv
        context.beginPath();
        context.moveTo(beginX, startY);
        context.lineTo(beginX, endY);
        context.stroke();

        // OY - desenare ani
        const sv = values.filter(x => x["indicator"] === "SV").map(x => x["valoare"]);
        let maxValue = Math.ceil(Math.max(...sv));
        let minValue = Math.floor(Math.min(...sv));
        const minY = minValue - 1;
        // console.log(maxValue); console.log(minValue);
        // console.log(Math.max(...sv)); console.log(Math.min(...sv))

        //pe oy un an mai putin decat primul an:
        context.fillText((minY).toString(), 5, endY);
        const yH = endY / (maxValue - minValue + 3);
        let pos = 2;
        //afiseaza anii din 2 in 2
        for (let i = minValue + 1; i <= maxValue + 2; i += 2) {
            context.fillText(((i).toString()), 5, endY - yH * pos);
            pos += 2;

            context.fillStyle = "#F8F8F8"
            context.lineWidth = 0.1;
            context.beginPath();
            context.moveTo(beginX, endY - yH * (pos - 2) - 2);
            context.lineTo(this.canvas.width, endY - yH * (pos - 2) - 2);
            context.stroke();

            //revenire
            context.lineWidth = 0.5;
            context.fillStyle = "#545454"
        }

        //OX axa-> pib
        context.beginPath();
        context.moveTo(beginX, endY);
        context.lineTo(this.canvas.width, endY);
        context.stroke();

        //OX -> desenare PIB
        const pib = values.filter(x => x["indicator"] === "PIB").map(x => x["valoare"]);
        maxValue = Math.max(...pib);
        minValue = Math.min(...pib);
        // console.log(maxValue, minValue);


        //rotunjire minim la  zeci mii
        minValue = Math.floor(minValue / 10000) * 10000;
        //rotunjire maxim la seci mii
        maxValue = Math.ceil(maxValue / 10000) * 10000;
        const nrValues = (maxValue - minValue) / 10000 + 1;

        const xW = (this.canvas.width - beginX) / nrValues;
        for (let i = 0; i < nrValues; i++) {
            context.fillText((minValue + (i * 10000)).toString(), beginX + i * xW, endY + 10);

            context.fillStyle = "#F8F8F8"
            context.lineWidth = 0.1;
            context.beginPath();
            context.moveTo(beginX + i * xW, endY + 10);
            context.lineTo(beginX + i * xW, startY);
            context.stroke();

            //revenire
            context.lineWidth = 0.5;
            context.fillStyle = "#545454"
        }
        //pe ox pe o distanta se gasesc 10000 ani
        const distX = xW / 10000;
        //minX = 0 MEREU; nu se mai trimite
        this.#drawData(values, context, minY, distX, yH);

    }

    #drawData(values, context, minY, distX, distY) {

        const pop = values.filter(x => x["indicator"] === "POP").map(x => x["valoare"]);
        const maxValueSize = Math.max(...pop);
        const maxR = this.canvas.height / 5; //raza maxima
        const f = maxR / maxValueSize; //f de scalare pt raza cercurilor

        //sort values dupa tara apoi dupa nume indicator ordine: PIB, POP, SV
        const sortedValues = values.sort((x1, x2) => {
            if (x1["tara"] < x2["tara"]) {
                return -1;
            }
            else if (x1["tara"] < x2["tara"]) {
                return 1;
            }
            else if (x1["tara"] === x2["tara"]) {
                if (x1["indicator"] < x2["indicator"]) {
                    return -1;
                }
                else if (x1["indicator"] > x2["indicator"]) {
                    return 1;
                }
                else return 0;
            }
        });

        //parcurgere in for din 3 in trei (3 valori pt o tara)
        for (let i = 0; i < sortedValues.length; i += 3) {

            const red = Math.round(Math.random() * 256);
            const green = Math.round(Math.random() * 256);
            const blue = Math.round(Math.random() * 256);
            context.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.4)`;

            context.beginPath();
            context.arc(15.5 + values[i]["valoare"] * distX,
                this.canvas.height - 15.5 - (values[i + 2]["valoare"] - minY) * distY,
                f * values[i + 1]["valoare"],
                0, Math.PI * 2);
            context.fill();

            context.fillStyle = "#8C52FF"
            context.textAlign = "center";
            context.font = "1px"
            //scriere tara deasupra cercului (nu este o vizualizare prea buna se vad datele mai bine fara)
            context.fillText(sortedValues[i]["tara"], 15.5 + values[i]["valoare"] * distX, this.canvas.height - 20.5 - (values[i + 2]["valoare"] - minY) * distY);
        }
    }

    draw(values, year) {

        const context = this.canvas.getContext("2d");
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //draw title:
        context.fillStyle = "#8C52FF"
        context.textAlign = "center";
        context.font = "6px"
        context.fillText(`Year: ${year} x = PIB, y = SV, size = POP`, 3 * this.canvas.width / 4, 10);
        this.#drawAxes(values, context);

    }

}


// COD PRINCIPAL -> codul trebuie rulat cu LiveServer pt a functiona functia fetch()
//citire json
let data;
fetch("media/eurostat.json")
    .then(response => response.json())
    .then(data => main(data))
    .catch(error => console.log(error));

//main
function main(data) {
    /*data = array de obiect
    obiect {tara: , an:  , indicator: , valoare: }*/

    //inlocuire valori null cu media
    data = data.map(x => {
        if (x["valoare"] == null) {
            const values = data.filter(elem => elem["indicator"] === x["indicator"] && elem["tara"] === x["tara"]).map(elem => elem["valoare"]);
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            x["valoare"] = Math.round(mean);
        } return x;
    });

    //CREARE VECT
    const countries = createVariables(data)[0];
    const indicators = createVariables(data)[1];
    const years = createVariables(data)[2];


    //POPULARE SELECT-uri
    const selectCountry = document.getElementById("tara");
    const selectIndicator = document.getElementById("indicator");
    const selectYearBubble = document.getElementById("anBubble");
    const selectYearTable = document.getElementById("anTable");
    populateSelect(selectCountry, countries);
    populateSelect(selectIndicator, indicators);
    populateSelect(selectYearBubble, years);
    populateSelect(selectYearTable, years);


    //DESENARE HISTOGRAMA
    const chart_div = document.getElementById("chart_div");
    const histogram = new Histogram(chart_div);
    const btnHistogram = document.getElementById("histogramButton");
    btnHistogram.addEventListener("click", () => drawHistogram(selectCountry, selectIndicator, data, histogram));

    //DESENARE BUBBLE CHART
    const bubbleChartDiv = document.getElementById("bubble_chart_div");
    const canvasBubble = document.getElementById("canvasBubbleChart")
    //set dimensiuni canvas: sa ocupe tot divul
    canvasBubble.height = bubbleChartDiv.clientHeight;
    canvasBubble.width = bubbleChartDiv.clientWidth;

    const bubbleChart = new BubbleChart(canvasBubble);
    const btnBubble = document.getElementById("bubbleButton");
    btnBubble.addEventListener("click", () => drawBubble(selectYearBubble, data, bubbleChart));


    //START BUBBLE CHART ANIMATIE
    let checkBoxState = false; //stare initiala a checkbox-ului
    let id; //pt metoda setInterval
    const checkBoxBubble = document.getElementById("animation");
    checkBoxBubble.addEventListener("change", () => {
        checkBoxState = !checkBoxState;
        if (checkBoxState === true) {
            btnBubble.disabled = true; //nu se poate cere desenare de bubble pe an pana nu se opreste animatia
            let position = 0;
            let countriesData;
            id = setInterval(() => {
                countriesData = data.filter(x => x["an"] === years[position]);
                //desenare
                bubbleChart.draw(countriesData, years[position]);
                if (position < years.length - 1) {
                    position++;
                } else {
                    position = 0;
                }
            }, 3000);

        } else {
            btnBubble.disabled = false; //se poate apasa pe buton
            clearInterval(id); //oprire animatie
        }
    });

    //POPULARE TABELA DE DATE -> se realizeaza la schimbarea anului din select
    selectYearTable.addEventListener("change", () => {
        //anul selectat
        const year = selectYearTable.options[selectYearTable.selectedIndex].text;
        //preluare date
        const filteredData = data.filter(x => x["an"] === year);
        //creare array de ob de tip {country:, sv:, pop:, pib:}
        const mapedData = []
        for (let i = 0; i < countries.length; i++) {
            const elem = {
                country: countries[i],
                SV: 0,
                POP: 0,
                PIB: 0
            }
            mapedData.push(elem);
        }
        for (let i = 0; i < filteredData.length; i++) {
            //sunt in acc ordine in vectorul mapat ca in vect countries
            const index = countries.indexOf(filteredData[i]["tara"]);
            switch (filteredData[i]["indicator"]) {
                case "SV":
                    mapedData[index].SV = filteredData[i]["valoare"];
                    break;
                case "POP":
                    mapedData[index].POP = filteredData[i]["valoare"];
                    break
                case "PIB":
                    mapedData[index].PIB = filteredData[i]["valoare"];
                    break;
            }
        }

        //medii indicatori pe UE
        const meanSV = mapedData.reduce((a, e) => a + e.SV, 0) / mapedData.length;
        const meanPOP = mapedData.reduce((a, e) => a + e.POP, 0) / mapedData.length;
        const meanPIB = mapedData.reduce((a, e) => a + e.PIB, 0) / mapedData.length;

        // pt colorare -> elem mai mici decat media; elem peste medie; scalele de colorare pentru fiecare dintre ele ca sa se ajunga la cul ROSU si VERDE corespunzator
        //um -> under //am -> above
        //um sortare descrescatoare -> cea mai mica valoare o sa fie cea mai rosie -> se va scadea cel mai mult din verde
        //255 de la rosu la galben + 255 de la galben la verde

        //SV
        const svUm = mapedData.map(x => parseFloat(x.SV)).filter(x => x <= meanSV).sort((x, y) => x < y ? 1 : -1);
        const scaleUM_SV = 255 / svUm.length;
        const svAm = mapedData.map(x => parseFloat(x.SV)).filter(x => x > meanSV).sort();
        const scaleAM_SV = 255 / svAm.length;
        //POP
        const popUM = mapedData.map(x => parseFloat(x.POP)).filter(x => x <= meanPOP).sort((x, y) => x < y ? 1 : -1);
        const scaleUM_POP = 255 / popUM.length;
        const popAM = mapedData.map(x => parseFloat(x.POP)).filter(x => x > meanPOP).sort();
        const scaleAM_POP = 255 / popAM.length;
        //PIB
        const pibUM = mapedData.map(x => parseFloat(x.PIB)).filter(x => x <= meanPIB).sort((x, y) => x < y ? 1 : -1);
        const scaleUM_PIB = 255 / pibUM.length;
        const pibAM = mapedData.map(x => parseFloat(x.PIB)).filter(x => x > meanPIB).sort();
        const scaleAM_PIB = 255 / pibAM.length;

        //stergere tabel anterior daca exista
        const tableBody = document.getElementById("tableBody");
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        
        //completare tabel + color scale
        for (let i = 0; i < mapedData.length; i++) {
            const tr = document.createElement("tr");
            //td tara
            let td = document.createElement("td");
            let tdText = document.createTextNode(mapedData[i].country);
            td.appendChild(tdText);
            tr.appendChild(td);

            //SV
            td = document.createElement("td");
            tdText = document.createTextNode(mapedData[i].SV);
            td.appendChild(tdText);
            tr.appendChild(td);
            //colorare
            if (mapedData[i].SV < meanSV) {
                const index = svUm.indexOf(mapedData[i].SV);
                const green = 255 - index * scaleUM_SV;
                td.style.backgroundColor = `rgba(255, ${green}, 0, 0.5)`;
            } else {
                const index = svAm.indexOf(mapedData[i].SV);
                const red = 255 - index * scaleAM_SV;
                td.style.backgroundColor = `rgba(${red}, 255, 0, 0.5)`;
            }

            //POP
            td = document.createElement("td");
            tdText = document.createTextNode(mapedData[i].POP);
            td.appendChild(tdText);
            tr.appendChild(td);
            //colorare
            if (mapedData[i].POP < meanPOP) {
                const index = popUM.indexOf(mapedData[i].POP);
                const green = 255 - index * scaleUM_POP;
                td.style.backgroundColor = `rgba(255, ${green}, 0, 0.5)`;
            } else {
                const index = popAM.indexOf(mapedData[i].POP);
                const red = 255 - index * scaleAM_POP;
                td.style.backgroundColor = `rgba(${red}, 255, 0, 0.5)`;
            }

            //PIB
            td = document.createElement("td");
            tdText = document.createTextNode(mapedData[i].PIB);
            td.appendChild(tdText);
            tr.appendChild(td);
            //colorare
            if (mapedData[i].PIB < meanPIB) {
                const index = pibUM.indexOf(mapedData[i].PIB);
                const green = 255 - index * scaleUM_PIB;
                td.style.backgroundColor = `rgba(255, ${green}, 0, 0.5)`;
            } else {
                const index = pibAM.indexOf(mapedData[i].PIB);
                const red = 255 - index * scaleAM_PIB;
                td.style.backgroundColor = `rgba(${red}, 255, 0, 0.5)`;
            }
            tableBody.appendChild(tr);
        }


    });
    
    //la resizeul paginii sa se modifice graficele 
    window.addEventListener("resize", ()=>{
        drawHistogram(selectCountry, selectIndicator, data, histogram);
        canvasBubble.height = bubbleChartDiv.clientHeight;
        canvasBubble.width = bubbleChartDiv.clientWidth;    
        const bubbleChartresize = new BubbleChart(canvasBubble);
        drawBubble(selectYearBubble, data, bubbleChartresize);
    });
}


function createVariables(data) {

    //vect pt tari
    let countries = [];
    for (let i = 0; i < data.length; i++) {
        if (countries.indexOf(data[i]["tara"]) == -1) {
            countries.push(data[i]["tara"]);
        }
    }
    //vect pentru indicatori
    let indicators = [];
    for (let i = 0; i < data.length; i++) {
        if (indicators.indexOf(data[i]["indicator"]) == -1) {
            indicators.push(data[i]["indicator"]);
        }
    }
    //vect pt ani
    let years = [];
    for (let i = 0; i < data.length; i++) {
        if (years.indexOf(data[i]["an"]) == -1) {
            years.push(data[i]["an"]);
        }
    }

    return [countries, indicators, years];
}

function populateSelect(select, values) {
    for (let i = 0; i < values.length; i++) {
        let option = document.createElement("option");
        option.text = values[i];
        select.add(option);
    }
}

function drawHistogram(selectCountry, selectIndicator, data, histogram) {
    const country = selectCountry.options[selectCountry.selectedIndex].text;
    const indicator = selectIndicator.options[selectIndicator.selectedIndex].text;
    if (country != "Tara" && indicator != "Indicatorul") {
        const countryData = data.filter(x => x["tara"] === country && x["indicator"] === indicator)
            .map(x => ([x["an"], parseFloat(x["valoare"])]));

        //desenare 
        histogram.draw(countryData, indicator, country);
    }
}


function drawBubble(selectYearBubble, data, bubbleChart) {
    const year = selectYearBubble.options[selectYearBubble.selectedIndex].text;
    if (year != "An") {
        const countriesData = data.filter(x => x["an"] === year);
        //desenare
        bubbleChart.draw(countriesData, year);
    }
}