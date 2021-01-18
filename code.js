class Grid {

    constructor () {
        this.grid = document.createElement("div");
        this.grid.classList.add("grid");
        this.rows = [];

        this.colTargets= document.getElementById("col-targets")

        for (let i = 0; i < 5; i++) {
            let newRow = new Row(5)
            this.grid.appendChild(newRow.row)
            this.rows.push(newRow)
            this.addColumnTarget()
        }
    }

    addNewRow(row){
        if (this.rows.length >= 10) {
            return
        }
        this.rows.push(row)
        this.grid.appendChild(row.row)
    }

    removeRow(){

        if (this.rows.length <= 1) return

        this.rows.pop()
        this.grid.removeChild(this.grid.lastChild)
    }

    addColumn(){
        if (this.rows[0].cells.length >= 10) {
            return
        }
        this.rows.forEach(row => {
            let cell = new Cell()
            row.cells.push(cell)
            row.row.appendChild(cell.cell)
        })

        this.addColumnTarget()
    }

    addColumnTarget() {
        let cTarget = document.createElement("h4")
        cTarget.classList.add("col-target")
        cTarget.innerHTML = "0"
        cTarget.addEventListener('click', () => {
            let newValue = prompt("New cell value")

            

            if (!isNaN(newValue)){
                cTarget.innerHTML = parseInt(newValue)
                
            }
        })
        this.colTargets.appendChild(cTarget)
    }

    removeColumn(){
        if (this.rows[0].cells.length <= 1) {
            return
        }

        this.rows.forEach(row => {
            row.cells.pop()
            row.row.removeChild(row.row.lastChild)
        })

        this.colTargets.removeChild(this.colTargets.lastChild)
    }



}

class Row {

    constructor (length) {

        this.row = document.createElement("div")
        this.row.classList.add("grid-row")
        this.cells = []

        this.rowTarget = document.createElement("h4")
        this.rowTarget.innerHTML = "1"
        this.rowTarget.classList.add("row-target")
        let clazz = this
        this.rowTarget.addEventListener('click', () => {
            let newValue = prompt("New cell value")

            

            if (!isNaN(newValue)){
                clazz.rowTarget.innerHTML = parseInt(newValue)
                
            }
        })
        this.row.appendChild(this.rowTarget)
        
        for (let i = 0; i < length; i++) {
            let newCell = new Cell()
            this.row.appendChild(newCell.cell)
            this.cells.push(newCell)
        }
    }


}

class Cell {

    constructor () {
        this.value = 1

        this.cell = document.createElement("div")
        this.cell.classList.add("cell")
        this.cell.innerHTML = "1"
        //this.cell.textContent = this.value

        let clazz = this

        this.cell.addEventListener('click', function(event) {
            let newValue = prompt("New cell value")

            

            if (!isNaN(newValue)){
                clazz.cell.innerHTML = parseInt(newValue)
                clazz.value = parseInt(newValue)
            }
        })
    }




}

let grid = null

function addRowButtons() {

    document.getElementById("add-row").addEventListener('click', function(event)  {
        let rowLength = grid.rows[0].cells.length
        grid.addNewRow(new Row(rowLength))
    })

    document.getElementById("remove-row").addEventListener('click', function(event)  {
        
        grid.removeRow()
    })
    


}

function addColumnButtons() {
    document.getElementById("add-col").addEventListener('click', function(event)  {
        grid.addColumn()
    })
    document.getElementById("remove-col").addEventListener('click', function(event)  {
        grid.removeColumn()
    })
}

function initSolveButton() {
    document.getElementById("solve").addEventListener('click', () => {
        let grid = gridParser()
        let jsonGrid = JSON.stringify(grid)
        makeRequest(jsonGrid)
    })
}


function makeRequest(json){
    fetch("https://web-ext-cw1-cs141.noahdhollowell.co.uk/grid", {
        method: "POST",
        body: json
    }).then(resp => resp.json())
    .then(data => {
        console.log(data)

        returnedData(data)
    })
    .catch(err => {
        alert("Something went wrong!")
    })

}

function returnedData(data){
    if (data.length == 0) {
        alert("This grid can't be solved")
        return
    } 

    let solvedArea = document.getElementById("solved-grids")
    solvedArea.innerHTML = ""
    let step = 1

    data.forEach(grid => {
        let domGrid = document.createElement("div")
        domGrid.classList.add("grid")

        grid.rows.forEach(row => {
            let domRow = document.createElement("div")
            domRow.classList.add("grid-row")

            row.cells.forEach(cell => {
                let domCell = document.createElement("div")
                domCell.classList.add("cell")

                if (cell.act.action === "add"){
                    domCell.innerHTML = cell.act.operand
                } else {
                    domCell.innerHTML = (cell.act.operand * -1)
                }

                domRow.appendChild(domCell)
            })

            domGrid.appendChild(domRow)
        })

        let domStep = document.createElement("h3")
        domStep.innerHTML = "Step " + step

        solvedArea.appendChild(domStep)
        solvedArea.appendChild(domGrid)
        step++
    })

        let modal = new bootstrap.Modal(document.getElementById("solve-modal"))
        modal.show()
    
}


function init() {
    grid = new Grid();
    console.log(grid)
    document.getElementById("grid").appendChild(grid.grid)
    addRowButtons()
    addColumnButtons()
    initSolveButton()
}

window.onload=init()





function gridParser() {
    let rows = []
    grid.rows.forEach(row => {
        let data = {}
        let cells = []
        
        row.cells.forEach(cell => {
            let c = {}
            if (cell.value >= 0){
                c['action'] = "add"
                c['operand'] = cell.value
            } else {
                c['action'] = "sub"
                c['operand'] = (cell.value * -1)
            }
            cells.push(c)
        })
        data['cells'] = cells
        data['target'] = parseInt(row.row.querySelector("h4").innerHTML)
        rows.push(data)
    })
    let res = {}
    res['rows'] = rows

    let colTargets = []
    grid.colTargets.childNodes.forEach(child => {
        colTargets.push(parseInt(child.innerHTML))
    })
    res['columns'] = colTargets

    return res
}